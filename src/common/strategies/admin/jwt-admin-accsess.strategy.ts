import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/common/configs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/databases/typeorm/entities/user.entity';

@Injectable()
export class JwtAdminAccessStrategy extends PassportStrategy(Strategy, 'jwt-admin-access') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const config = configService.getOrThrow<ConfigType<typeof JwtConfig>>('jwt');
    if (!config.admin.accessSecret) {
      throw new Error('JWT_ADMIN_ACCESS_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.admin.accessSecret,
      audience: config.admin.audience,
      issuer: config.admin.issuer,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        roles: {
          name: true,
          permissions: {
            name: true,
          },
        },
      },
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
