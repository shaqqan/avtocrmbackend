import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/common/configs';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class JwtAdminAccessStrategy extends PassportStrategy(Strategy, 'jwt-admin-access-token') {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly i18n: I18nService,
    ) {
        const config = configService.getOrThrow<ConfigType<typeof JwtConfig>>('jwt');
        if (!config?.admin.accessSecret) throw new Error('JWT_ADMIN_ACCESS_SECRET is not defined');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.admin.accessSecret,
        });
    }

    async validate(payload: { email: string }) {
        const user = await this.prisma.user.findUnique({
            include: {
                roles: true,
            },
            where: {
                email: payload.email,
            }
        });

        if (!user) {
            throw new UnauthorizedException(this.i18n.t('errors.AUTH.UNAUTHORIZED'));
        }

        return user;
    }
}
