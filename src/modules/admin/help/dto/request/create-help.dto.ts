import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateHelpDto {
    @ApiProperty({ description: 'Help topic name in Uzbek', example: 'Qanday ro\'yxatdan o\'tish mumkin?' })
    @IsString()
    @IsNotEmpty()
    name_uz: string;

    @ApiProperty({ description: 'Help topic name in Russian', example: 'Как можно зарегистрироваться?' })
    @IsString()
    @IsNotEmpty()
    name_ru: string;

    @ApiProperty({ description: 'Help topic name in English', example: 'How to register?' })
    @IsString()
    @IsNotEmpty()
    name_en: string;

    @ApiProperty({ description: 'Help topic description in Uzbek', example: 'Ro\'yxatdan o\'tish uchun batafsil qo\'llanma' })
    @IsString()
    @IsNotEmpty()
    description_uz: string;

    @ApiProperty({ description: 'Help topic description in Russian', example: 'Подробное руководство по регистрации' })
    @IsString()
    @IsNotEmpty()
    description_ru: string;

    @ApiProperty({ description: 'Help topic description in English', example: 'Detailed guide for registration process' })
    @IsString()
    @IsNotEmpty()
    description_en: string;
}
