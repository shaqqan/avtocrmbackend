import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './common/configs';
import { ConfigService, ConfigType } from '@nestjs/config';
import { setupSwaggerAdmin } from './common/swagger';
import { ValidationErrorHandler } from './common/pipes';
import { I18nService } from 'nestjs-i18n';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { asset } from './common/utils/asset';
import * as path from 'path';
import { Logger } from '@nestjs/common';

(async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      bodyLimit: 1024 * 1024 * 10, // 10MB
      // High-performance server options
      trustProxy: true,
      ignoreTrailingSlash: true,
      // Optimize for low latency
      connectionTimeout: 30000,
      keepAliveTimeout: 65000,
      maxRequestsPerSocket: 1000,
      // Disable unnecessary features in production
      disableRequestLogging: isProd,
    }),
    {
      // Optimize logging for production performance
      logger: isProd ? false : ['error', 'warn'],
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        maxAge: 3600, // Cache preflight requests for 1 hour
        optionsSuccessStatus: 200, // For legacy browser support
      },
      bufferLogs: true, // Buffer logs for better performance
      abortOnError: false, // Don't abort on errors for better uptime
    },
  );

  global.asset = asset;

  const i18n = app.get(I18nService);
  await app.register(require('@fastify/multipart'), {
    // Attach fields to request (muhim!)
    attachFieldsToBody: true,
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000,
      fields: 10,
      fileSize: 10000000, // 10MB
      files: 5,
      headerPairs: 2000,
    },
  });

  await app.register(require('@fastify/static'), {
    root: path.join(process.cwd(), 'storage'),
    prefix: '/storage/',
    // Optimize static file serving
    maxAge: 31536000, // 1 year cache
    immutable: true,
  });

  // Create a standard logger
  // const logger = new Logger('Application');

  // Register global filters and pipes in the correct order
  // app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalPipes(new ValidationErrorHandler(i18n));
  app.setGlobalPrefix('api');

  // Enhanced compression configuration for maximum performance
  if (isProd) {
    await app.register(require('@fastify/compress'), {
      encodings: ['gzip'],
      threshold: 2048,
      zlibOptions: {
        level: 4,
        memLevel: 8,
      },
    });
  }

  if (!isProd) {
    setupSwaggerAdmin(app);
  }

  const configService = app.get(ConfigService);
  const serverConfig =
    configService.getOrThrow<ConfigType<typeof AppConfig>>('node');

  // Performance optimization: set TCP_NODELAY and SO_KEEPALIVE
  await app.listen(
    {
      port: serverConfig.port,
      host: serverConfig.host,
      // High-performance server options
      backlog: 511, // Maximum length of the queue of pending connections
    },
    async () => {
      const url = await app.getUrl();
      console.log(
        `🚀🚀 Server is running on ${url} in ${serverConfig.env} mode`,
        {
          module: 'main',
          method: 'bootstrap',
          type: 'server_startup',
          port: serverConfig.port,
          host: serverConfig.host,
          environment: serverConfig.env,
        }
      );

      if (isProd) {
        console.log('🚀 Production mode: Optimized for maximum performance', {
          module: 'main',
          method: 'bootstrap',
          type: 'server_startup',
          mode: 'production',
        });
        console.log('🚀 Target: Sub-5ms response times', {
          module: 'main',
          method: 'bootstrap',
          type: 'server_startup',
          target: 'sub_5ms_response_times',
        });
      }
    },
  );
})();
