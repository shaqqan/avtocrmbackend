import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { Configs } from './common/configs';
import { RedisModule } from './databases/redis/redis.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { I18nConfig } from './common/configs/i18n.config';
import { CustomTypeOrmModule } from './databases/typeorm/typeorm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: Configs,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage:
          configService.getOrThrow<ConfigType<typeof I18nConfig>>('i18n')
            .fakerLocale,
        loaderOptions: {
          path: path.join(process.cwd(), 'src/i18n/'),
          watch: process.env.NODE_ENV !== 'production',
        },
      }),
      resolvers: [new HeaderResolver(['x-lang'])],
      inject: [ConfigService],
    }),
    RedisModule,
    ModulesModule,
    CustomTypeOrmModule,
  ],
})
export class AppModule {}
