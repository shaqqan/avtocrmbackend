import { ApiProperty } from '@nestjs/swagger';
import { User } from 'generated/prisma';

class Tokens {
    @ApiProperty({
        description: 'The access token',
        example: 'fake-jwt-token'
    })
    accessToken: string;

    @ApiProperty({
        description: 'The refresh token',
        example: 'fake-jwt-token'
    })
    refreshToken: string;
}

export class SignInResponseDto {
    @ApiProperty({
        description: 'The tokens',
        type: Tokens
    })
    tokens: Tokens;
}
