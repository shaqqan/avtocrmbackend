import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAdminStrategy } from 'src/common/strategies/admin/jwt-admin.strategy';
import { PrismaModule } from 'src/databases/prisma/prisma.module';
import { RedisModule } from 'src/databases/redis/redis.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtConfig } from 'src/common/configs';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<ConfigType<typeof JwtConfig>>('jwt')
        return {
          secret: jwtConfig.admin.secret,
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAdminStrategy],
  exports: [AuthService]
})
export class AuthModule { }
