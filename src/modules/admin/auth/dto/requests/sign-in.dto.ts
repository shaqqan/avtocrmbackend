import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
    @IsEmail({}, {
        message: 'errors.VALIDATION.IS_EMAIL'
    })
    @IsNotEmpty({
        message: 'errors.VALIDATION.NOT_EMPTY'
    })
    @MaxLength(255, {
        message: 'errors.VALIDATION.MAX_LENGTH'
    })
    @ApiProperty({
        description: 'The email of the user',
        example: 'admin@kitob.uz'
    })
    email: string;

    @IsString({
        message: 'errors.VALIDATION.IS_STRING'
    })
    @IsNotEmpty({
        message: 'errors.VALIDATION.NOT_EMPTY'
    })
    @MinLength(6, {
        message: 'errors.VALIDATION.MIN_LENGTH'
    })
    @MaxLength(255, {
        message: 'errors.VALIDATION.MAX_LENGTH',
    })
    @ApiProperty({
        description: 'The password of the user',
        example: 'Password123!'
    })
    password: string;
}
