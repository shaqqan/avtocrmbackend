import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AppConfig } from './common/configs';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService);
  const serverConfig =
    configService.getOrThrow<ConfigType<typeof AppConfig>>('node');

  app.setGlobalPrefix('api');

  await app.listen(serverConfig.port, serverConfig.host, async () => {
    console.log(`Server is running on ${await app.getUrl()}`);
  });
}
bootstrap();
