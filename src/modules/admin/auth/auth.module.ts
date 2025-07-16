import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/databases/prisma/prisma.module';
import { RedisModule } from 'src/databases/redis/redis.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtConfig } from 'src/common/configs';
import { JwtAdminAccessStrategy } from 'src/common/strategies/admin/jwt-admin-accsess.strategy';
import { JwtAdminRefreshStrategy } from 'src/common/strategies/admin/jwt-admin-refresh.strategy';

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
          secret: jwtConfig.admin.accessSecret,
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAdminAccessStrategy,
    JwtAdminRefreshStrategy
  ],
  exports: [AuthService]
})
export class AuthModule { }
