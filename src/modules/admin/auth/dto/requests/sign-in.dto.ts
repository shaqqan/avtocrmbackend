import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInDto {
    @IsEmail({}, {
        message: i18nValidationMessage('errors.VALIDATION.IS_EMAIL')
    })
    @IsNotEmpty({
        message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY')
    })
    @MaxLength(255, {
        message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH')
    })
    @ApiProperty({
        description: 'The email of the user',
        example: 'admin@kitob.uz'
    })
    email: string;

    @IsString({
        message: i18nValidationMessage('errors.VALIDATION.IS_STRING')
    })
    @IsNotEmpty({
        message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY')
    })
    @MinLength(6, {
        message: i18nValidationMessage('errors.VALIDATION.MIN_LENGTH')
    })
    @MaxLength(255, {
        message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
    })
    @ApiProperty({
        description: 'The password of the user',
        example: 'Password123!'
    })
    password: string;
}
