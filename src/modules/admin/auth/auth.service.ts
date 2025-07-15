import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../databases/prisma/prisma.service';
import { SignInDto } from './dto/requests/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { SignInResponseDto } from './dto/responses/sign-in.res';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/databases/redis/redis.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
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
      tokens,
    };
  }

  async refreshTokens(user: User) {

    const isValid = await this.redisService.get(`refresh_token_${user.id}`);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);
    return {
      tokens,
    };
  }

  private async generateTokens(user: User): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const refreshTokenId = randomUUID();

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    await this.redisService.setWithExpiry(`refresh_token_${user.id}`, refreshToken, 60 * 60 * 24 * 7);

    return {
      accessToken,
      refreshToken,
    };
  }

}
