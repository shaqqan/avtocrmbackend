import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsString, IsNotEmpty, IsOptional, Min, Max, MaxLength } from "class-validator";
import { Author, BookLangEnum, Genre, Issuer, PublishedEnum, File } from "src/databases/typeorm/entities";
import { Exists } from "src/common/decorators/validators";

export class CreateBookDto {
    @ApiProperty({ description: 'Book name in Russian', example: 'Война и мир', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name_ru: string;

    @ApiProperty({ description: 'Book name in Uzbek', example: 'Urush va tinchlik', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name_uz: string;

    @ApiProperty({ description: 'Book name in English', example: 'War and Peace', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name_en: string;

    @ApiProperty({ description: 'Book description in Uzbek', example: 'Bu kitob Tolstoyning eng mashhur asari...', maxLength: 1500 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1500)
    description_uz: string;

    @ApiProperty({ description: 'Book description in Russian', example: 'Эта книга является самым известным произведением Толстого...', maxLength: 1500 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1500)
    description_ru: string;

    @ApiProperty({ description: 'Book description in English', example: 'This book is Tolstoy\'s most famous work...', maxLength: 1500 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1500)
    description_en: string;

    @ApiProperty({ description: 'Short description in Uzbek', example: 'Qisqa tavsif...', maxLength: 1500, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1500)
    description_short_uz?: string;

    @ApiProperty({ description: 'Short description in Russian', example: 'Краткое описание...', maxLength: 1500, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1500)
    description_short_ru?: string;

    @ApiProperty({ description: 'Short description in English', example: 'Short description...', maxLength: 1500, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1500)
    description_short_en?: string;

    @ApiProperty({ 
        description: 'Book language', 
        example: BookLangEnum.UZ,
        enum: BookLangEnum 
    })
    @IsEnum(BookLangEnum)
    lang: BookLangEnum;

    @ApiProperty({ description: 'Publication year', example: 1869, minimum: 1000, maximum: 2030 })
    @IsNumber()
    @Min(1000)
    @Max(2030)
    year: number;

    @ApiProperty({ description: 'ISBN number', example: '978-5-17-085083-7', maxLength: 50, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    ISBN?: string;

    @ApiProperty({ description: 'Number of pages', example: 1225, minimum: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    pages?: number;

    @ApiProperty({ 
        description: 'Publication status', 
        example: PublishedEnum.PUBLISHED,
        enum: PublishedEnum 
    })
    @IsEnum(PublishedEnum)
    published: PublishedEnum;

    @ApiProperty({ description: 'Top rating (0-10)', example: 8, minimum: 0, maximum: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    top?: number;

    @ApiProperty({ description: 'Cover image path', example: 'storage/covers/war-and-peace.jpg', maxLength: 255, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    cover?: string;

    @ApiProperty({ description: 'Author IDs', example: [1, 2], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Author, 'id', { message: 'errors.BOOK.INVALID_AUTHORS' })
    authorsIds: number[];

    @ApiProperty({ description: 'Genre IDs', example: [1, 3], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Genre, 'id', { message: 'errors.BOOK.INVALID_GENRES' })
    genresIds: number[];

    @ApiProperty({ description: 'Issuer/Publisher IDs', example: [1], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Issuer, 'id', { message: 'errors.BOOK.INVALID_ISSUERS' })
    issuersIds: number[];

    @ApiProperty({ description: 'File IDs (PDFs, EPUBs, etc.)', example: [1, 2], type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(File, 'id', { message: 'errors.BOOK.INVALID_FILES' })
    filesIds?: number[];
}
