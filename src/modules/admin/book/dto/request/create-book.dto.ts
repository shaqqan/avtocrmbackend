import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { Author, BookLangEnum, Genre, Issuer, PublishedEnum } from "src/databases/typeorm/entities";
import { Exists } from "src/common/decorators/validators";

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

    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Author, 'id')
    authorsIds: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Genre, 'id')
    genresIds: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Issuer, 'id')
    issuersIds: number[];
}
