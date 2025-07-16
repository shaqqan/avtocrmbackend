import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/common/configs';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class JwtAdminAccessStrategy extends PassportStrategy(Strategy, 'jwt-admin-access-token') {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
        const config = configService.get<ConfigType<typeof JwtConfig>>('jwt');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.admin.accessSecret,
        });
    }

    async validate(payload: { email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        });

        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }

        return user;
    }
}
