import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({
        example: {
            uz: 'Foydalanuvchi yaratishga ruxsat berish',
            ru: 'Разрешение на создание пользователя',
            en: 'Permission to create user',
        }
    })
    @IsObject()
    @IsNotEmpty()
    name: object;

    @ApiProperty({ example: 'create_user' })
    @IsString()
    @IsNotEmpty()
    action: string;
} 