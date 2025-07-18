import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'The access token',
    example: 'fake-jwt-token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token',
    example: 'fake-jwt-token',
  })
  refreshToken: string;
}
