import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AppConfig } from './common/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const serverConfig =
    configService.getOrThrow<ConfigType<typeof AppConfig>>('node');

  app.setGlobalPrefix('api');

  await app.listen(serverConfig.port, serverConfig.host, async () => {
    console.log(`Server is running on ${await app.getUrl()}`);
  });
}
bootstrap();
