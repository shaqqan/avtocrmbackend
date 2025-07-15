import { Global, Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configs } from './common/configs';
import { PrismaModule } from './databases/prisma/prisma.module';
import { RedisModule } from './databases/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: Configs,
    }),
    PrismaModule,
    ModulesModule,
    RedisModule,
  ],
})
export class AppModule { }
