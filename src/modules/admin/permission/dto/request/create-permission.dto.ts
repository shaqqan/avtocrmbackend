import { IsString, IsNotEmpty, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePermissionDto {
    @ApiProperty({
        example: {
            uz: 'Foydalanuvchi yaratishga ruxsat berish',
            ru: 'Разрешение на создание пользователя',
            en: 'Permission to create user',
        },
        maxLength: 255,
    })
    @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
    @IsObject()
    @IsNotEmpty()
    name: object;

    @ApiProperty({
        example: 'create_user',
        maxLength: 255,
    })
    @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
    @IsString()
    @IsNotEmpty()
    action: string;
} 