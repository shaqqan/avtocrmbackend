import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/common/configs';
import { RedisService } from 'src/databases/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/databases/typeorm/entities/user.entity';

@Injectable()
export class JwtAdminRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-admin-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const config =
      configService.getOrThrow<ConfigType<typeof JwtConfig>>('jwt');
    if (!config.admin.refreshSecret) {
      throw new Error('JWT_ADMIN_REFRESH_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.admin.refreshSecret,
      audience: config.admin.audience,
      issuer: config.admin.issuer,
    });
  }

  async validate(payload: any) {
    const { id, refreshTokenId } = payload;

    const storedRefreshTokenId = await this.redisService.get(
      `refresh_token_${id}`,
    );

    if (!storedRefreshTokenId || storedRefreshTokenId !== refreshTokenId) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
