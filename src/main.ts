import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './common/configs';
import { ConfigService, ConfigType } from '@nestjs/config';
import { setupSwaggerAdmin } from './common/swagger';
import { ValidationErrorHandler } from './common/pipes';
import { I18nService } from 'nestjs-i18n';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import fastifyMultipart from '@fastify/multipart';
import { asset } from './common/utils/asset';
import fastifyStatic from '@fastify/static';
import * as path from 'path';

(async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      caseSensitive: true,
      ignoreTrailingSlash: true,
      bodyLimit: 1024 * 1024 * 10, // 10MB
    }),
    {
      logger: ['error', 'warn', 'verbose', 'debug'],
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        maxAge: 600, // Cache preflight requests for 10 minutes
      },
      bufferLogs: true, // Buffer logs for better performance
    },
  );

  global.asset = asset;

  const i18n = app.get(I18nService);
  await app.register(fastifyMultipart);

  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'storage'),
    prefix: '/storage/',
  });

  // Register global filters and pipes in the correct order
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(ConfigService), i18n));
  app.useGlobalPipes(new ValidationErrorHandler(i18n));

  app.setGlobalPrefix('api');

  // Enhanced compression configuration
  await app.register(compression, {
    encodings: ['gzip', 'deflate'],
    threshold: 1024, // Only compress responses > 1KB
  });

  setupSwaggerAdmin(app);

  const configService = app.get(ConfigService);
  const serverConfig =
    configService.getOrThrow<ConfigType<typeof AppConfig>>('node');

  await app.listen(serverConfig.port, serverConfig.host, async () => {
    const url = await app.getUrl();
    console.log(`🚀🚀 Server is running on ${url} in ${serverConfig.env} mode`);
  });
})();
