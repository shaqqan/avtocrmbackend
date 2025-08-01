import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum, IsOptional } from "class-validator";
import { NewsStatus } from "src/databases/typeorm/entities/news.entity";

export class CreateNewsDto {
    @ApiProperty({ description: 'News title in Uzbek', example: 'Yangi kitob chiqdi' })
    @IsString()
    @IsNotEmpty()
    title_uz: string;

    @ApiProperty({ description: 'News title in Russian', example: 'Вышла новая книга' })
    @IsString()
    @IsNotEmpty()
    title_ru: string;

    @ApiProperty({ description: 'News title in English', example: 'New book released' })
    @IsString()
    @IsNotEmpty()
    title_en: string;

    @ApiProperty({ description: 'News description in Uzbek', example: 'Yangi kitob haqida batafsil ma\'lumot' })
    @IsString()
    @IsNotEmpty()
    description_uz: string;

    @ApiProperty({ description: 'News description in Russian', example: 'Подробная информация о новой книге' })
    @IsString()
    @IsNotEmpty()
    description_ru: string;

    @ApiProperty({ description: 'News description in English', example: 'Detailed information about the new book' })
    @IsString()
    @IsNotEmpty()
    description_en: string;

    @ApiProperty({ description: 'News cover image path', example: 'storage/covers/news.jpg' })
    @IsString()
    @IsNotEmpty()
    cover: string;

    @ApiProperty({ 
        description: 'News status', 
        example: NewsStatus.ACTIVE,
        enum: NewsStatus,
        required: false
    })
    @IsOptional()
    @IsEnum(NewsStatus)
    status?: NewsStatus;
}
