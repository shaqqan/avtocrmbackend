import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './common/configs';
import { ConfigService, ConfigType } from '@nestjs/config';
import { setupSwaggerAdmin } from './common/swagger';
import { ValidationErrorHandler } from './common/pipes';
import { I18nService } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const i18n = app.get(I18nService);
  app.useGlobalPipes(new ValidationErrorHandler(i18n));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.setGlobalPrefix('api');
  app.use(compression());

  setupSwaggerAdmin(app);

  const configService = app.get(ConfigService)
  const serverConfig = configService.getOrThrow<ConfigType<typeof AppConfig>>('node')

  await app.listen(serverConfig.port, serverConfig.host, async () => {
    const url = await app.getUrl();
    console.log(`🚀🚀 Server is running on ${url}`);
  });
})();