import { ApiProperty } from '@nestjs/swagger';

export class SignOutResponseDto {
    @ApiProperty({
        description: 'The message',
        example: 'Signed out successfully'
    })
    message: string;
}