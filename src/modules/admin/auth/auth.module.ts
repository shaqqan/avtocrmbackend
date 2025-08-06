import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/databases/typeorm/entities';
import {
  JwtAdminAccessStrategy,
  JwtAdminRefreshStrategy,
} from 'src/common/strategies/admin';
import { RedisModule } from 'src/databases/redis/redis.module';

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAdminAccessStrategy, JwtAdminRefreshStrategy],
})
export class AuthModule {}
