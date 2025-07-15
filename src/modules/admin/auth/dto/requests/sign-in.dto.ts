import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    @ApiProperty({
        description: 'The email of the user',
        example: 'user@kitob.uz'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    @ApiProperty({
        description: 'The password of the user',
        example: 'User123!'
    })
    password: string;
}
