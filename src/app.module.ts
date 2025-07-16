import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { Configs } from './common/configs';
import { PrismaModule } from './databases/prisma/prisma.module';
import { RedisModule } from './databases/redis/redis.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'node:path';
import { I18nConfig } from './common/configs/i18n.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: Configs,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow<ConfigType<typeof I18nConfig>>('i18n').fakerLocale,
        loaderOptions: {
          path: join(process.cwd(), 'src/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
    PrismaModule,
    ModulesModule,
    RedisModule,
  ],
})
export class AppModule { }
