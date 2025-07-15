import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './common/configs';
import { ConfigService, ConfigType } from '@nestjs/config';
import { setupSwaggerAdmin } from './common/swagger';
import { ValidationErrorHandler } from './common/pipes';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationErrorHandler());
  setupSwaggerAdmin(app);

  const configService = app.get(ConfigService)
  const serverConfig = configService.get<ConfigType<typeof AppConfig>>('node')

  await app.listen(serverConfig.port, serverConfig.host, async () => {
    const url = await app.getUrl();
    console.log(`🚀🚀 Server is running on ${url}`);
  });
})();