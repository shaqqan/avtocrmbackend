import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../databases/prisma/prisma.service';
import { SignInDto } from './dto/requests/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { SignInResponseDto } from './dto/responses/sign-in.res';
import { Role, User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/databases/redis/redis.service';
import { randomUUID } from 'node:crypto';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtConfig } from 'src/common/configs';
import { GetMeResponseDto } from './dto/responses/get-me';
import { SignOutResponseDto } from './dto/responses/sign-out';
import { RefreshTokenResponseDto } from './dto/responses/refresh-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) { }

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: new GetMeResponseDto(user),
      tokens,
    };
  }

  async refreshTokens(user: User): Promise<RefreshTokenResponseDto> {
    const tokens = await this.generateTokens(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signOut(user: User): Promise<SignOutResponseDto> {
    await this.redisService.delete(`refresh_token_${user.id}`);
    return {
      message: 'Signed out successfully',
    };
  }

  async getMe(user: User): Promise<GetMeResponseDto> {
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: { include: { role: true } } }
    });

    return {
      id: userWithRoles.id,
      email: userWithRoles.email,
      firstName: userWithRoles.firstName,
      lastName: userWithRoles.lastName,
      roles: userWithRoles.roles.map((role) => role.role.name),
    };
  }

  private async generateTokens(user: User): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const config = this.configService.get<ConfigType<typeof JwtConfig>>('jwt');
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: config.admin.accessSecret,
        audience: config.admin.audience,
        expiresIn: config.admin.accessTokenTtl,
        issuer: config.admin.issuer,
      }),

      this.jwtService.signAsync({
        ...payload,
        refreshTokenId,
      }, {
        secret: config.admin.refreshSecret,
        audience: config.admin.audience,
        expiresIn: config.admin.refreshTokenTtl,
        issuer: config.admin.issuer,
      }),
    ]);

    await this.redisService.setWithExpiry(`refresh_token_${user.id}`, refreshTokenId, config.admin.refreshTokenTtl);

    return {
      accessToken,
      refreshToken,
    };
  }

}
