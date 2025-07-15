import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/requests/sign-in.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInResponseDto } from './dto/responses/sign-in.res';
import { ApiGlobalResponses } from 'src/common/decorators/admin/swagger';
import { GetUser } from 'src/common/decorators/admin/get-user.decorator';
import { User } from 'generated/prisma';
import { JwtAuthAdminGuard } from 'src/common/guards/admin/jwt-auth-admin.guard';

@Controller('admin/auth')
@ApiTags('Admin Auth')
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
  @UseGuards(JwtAuthAdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiGlobalResponses()
  public refreshTokens(@GetUser() user: User) {
    return this.authService.refreshTokens(user);
  }

}
