import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './common/configs';
import { ConfigService, ConfigType } from '@nestjs/config';
import { setupSwaggerAdmin } from './common/swagger';
import { ValidationErrorHandler } from './common/pipes';
import { I18nService, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

(async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,
    new FastifyAdapter({
      // Performance optimizations
      caseSensitive: true, // Faster route lookup
      ignoreTrailingSlash: true, // Reduce route matching complexity
      maxParamLength: 100, // Limit param length for security and performance
      bodyLimit: 1048576, // 1MB body size limit
      onProtoPoisoning: 'remove', // Security and performance
      onConstructorPoisoning: 'remove',
      disableRequestLogging: true, // Reduce I/O overhead
      return503OnClosing: true, // Proper shutdown handling
      trustProxy: true, // Important if behind a proxy
    }),
    {
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        maxAge: 600, // Cache preflight requests for 10 minutes
      },
      bufferLogs: true, // Buffer logs for better performance
    });

  const i18n = app.get(I18nService);
  app.useGlobalPipes(new ValidationErrorHandler(i18n));
  app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(ConfigService)));
  app.setGlobalPrefix('api');

  // Enhanced compression configuration
  await app.register(compression, {
    encodings: ['gzip', 'deflate'],
    threshold: 1024, // Only compress responses > 1KB
  });

  setupSwaggerAdmin(app);

  const configService = app.get(ConfigService)
  const serverConfig = configService.getOrThrow<ConfigType<typeof AppConfig>>('node')

  await app.listen(serverConfig.port, serverConfig.host, async () => {
    const url = await app.getUrl();
    console.log(`🚀🚀 Server is running on ${url} in ${serverConfig.env} mode`);
  });
})();