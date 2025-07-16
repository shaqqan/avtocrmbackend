import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/common/configs';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable()
export class JwtAdminRefreshStrategy extends PassportStrategy(Strategy, 'jwt-admin-refresh-token') {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {
        const config = configService.get<ConfigType<typeof JwtConfig>>('jwt');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.admin.refreshSecret,
        });
    }

    async validate(payload: { id: number, email: string, refreshTokenId: string }) {
        const refreshToken = await this.redisService.get(`refresh_token_${payload.id}`);
        if (!refreshToken || refreshToken !== payload.refreshTokenId) {
            throw new UnauthorizedException('Unauthorized');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.id,
                email: payload.email,
            }
        });

        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }

        return user;
    }
}
