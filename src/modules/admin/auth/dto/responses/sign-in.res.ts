import { ApiProperty } from '@nestjs/swagger';
import { GetMeResponseDto } from './get-me';
import { RefreshTokenResponseDto } from './refresh-token';

export class SignInResponseDto {
  @ApiProperty({
    description: 'The user',
    type: GetMeResponseDto,
  })
  user: GetMeResponseDto;

  @ApiProperty({
    description: 'The tokens',
    type: RefreshTokenResponseDto,
  })
  tokens: RefreshTokenResponseDto;
}
