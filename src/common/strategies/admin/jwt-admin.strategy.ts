import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from 'src/common/configs';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
        const config = configService.get<ConfigType<typeof JwtConfig>>('jwt');
        console.log('JWT Config:', config); // Debug log
        
        if (!config?.admin?.secret) {
            throw new Error('JWT admin secret is not configured');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.admin.secret,
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
