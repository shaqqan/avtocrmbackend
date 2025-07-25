import { IsEnum, IsNumber, IsString } from "class-validator";
import { BookLangEnum, PublishedEnum } from "src/databases/typeorm/entities";

export class CreateBookDto {
    @IsString()
    name_ru: string;

    @IsString()
    name_uz: string;

    @IsString()
    name_en: string;

    @IsString()
    description_uz: string;

    @IsString()
    description_ru: string;

    @IsString()
    description_en: string;

    @IsString()
    description_short_uz: string;

    @IsString()
    description_short_ru: string;

    @IsString()
    description_short_en: string;

    @IsEnum(BookLangEnum)
    lang: BookLangEnum;

    @IsNumber()
    year: number;

    @IsString()
    ISBN: string;

    @IsNumber()
    pages: number;

    @IsEnum(PublishedEnum)
    published: PublishedEnum;

    @IsNumber()
    top: number;

    @IsString()
    cover: string;
}
