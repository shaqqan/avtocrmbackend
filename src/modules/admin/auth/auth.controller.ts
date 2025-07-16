import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/requests/sign-in.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInResponseDto } from './dto/responses/sign-in.res';
import { ApiGlobalResponses } from 'src/common/decorators/admin/swagger';
import { GetUser } from 'src/common/decorators/admin/get-user.decorator';
import { User } from 'generated/prisma';
import { JwtAuthAdminRefreshGuard } from 'src/common/guards/admin/jwt-auth-admin-refresh.guard';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';
import { GetMeResponseDto } from './dto/responses/get-me';
import { SignOutResponseDto } from './dto/responses/sign-out';
import { RefreshTokenResponseDto } from './dto/responses/refresh-token';

@Controller('admin/auth')
@ApiTags('🔐 Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in to the admin panel' })
  @ApiGlobalResponses()
  public signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }


  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthAdminRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiGlobalResponses()
  public refreshTokens(@GetUser() user: User): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshTokens(user);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthAdminAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign out' })
  @ApiGlobalResponses()
  public signOut(@GetUser() user: User): Promise<SignOutResponseDto> {
    return this.authService.signOut(user);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthAdminAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get me' })
  @ApiGlobalResponses()
  public getMe(@GetUser() user: User): Promise<GetMeResponseDto> {
    return this.authService.getMe(user);
  }

}
