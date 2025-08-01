import { IsEnum, IsNumber, IsOptional, IsString, IsNotEmpty, IsArray, Min, Max, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AudioBookLangEnum, AudioBookPublishedEnum, Author, Genre, Issuer, File } from "src/databases/typeorm/entities";
import { Exists } from "src/common/decorators/validators";

export class CreateAudioBookDto {
    @ApiProperty({ description: 'AudioBook name in Russian', example: 'Война и мир (аудиокнига)', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name_ru: string;

    @ApiProperty({ description: 'AudioBook name in Uzbek', example: 'Urush va tinchlik (audiokitob)', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name_uz: string;

    @ApiProperty({ description: 'AudioBook name in English', example: 'War and Peace (audiobook)', maxLength: 100, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name_en?: string;

    @ApiProperty({ description: 'AudioBook description in Uzbek', example: 'Bu audiokitob Tolstoyning eng mashhur asari...', maxLength: 1500 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1500)
    description_uz: string;

    @ApiProperty({ description: 'AudioBook description in Russian', example: 'Эта аудиокнига является самым известным произведением Толстого...', maxLength: 1500 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(1500)
    description_ru: string;

    @ApiProperty({ description: 'AudioBook description in English', example: 'This audiobook is Tolstoy\'s most famous work...', maxLength: 1500, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1500)
    description_en?: string;

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
        description: 'AudioBook language', 
        example: AudioBookLangEnum.UZ,
        enum: AudioBookLangEnum 
    })
    @IsEnum(AudioBookLangEnum)
    lang: AudioBookLangEnum;

    @ApiProperty({ description: 'Publication year', example: 1869, minimum: 1000, maximum: 2030 })
    @IsNumber()
    @Min(1000)
    @Max(2030)
    year: number;

    @ApiProperty({ description: 'ISBN code', example: '978-5-17-085083-7', maxLength: 50, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    ISBN?: string;

    @ApiProperty({ description: 'Duration in minutes', example: 1320, minimum: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    duration?: number;

    @ApiProperty({ 
        description: 'Publication status', 
        example: AudioBookPublishedEnum.PUBLISHED,
        enum: AudioBookPublishedEnum, 
        required: false 
    })
    @IsOptional()
    @IsEnum(AudioBookPublishedEnum)
    published?: AudioBookPublishedEnum;

    @ApiProperty({ description: 'Top rating (0-10)', example: 9, minimum: 0, maximum: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    top?: number;

    @ApiProperty({ description: 'Cover image path', example: 'storage/covers/war-and-peace-audio.jpg', maxLength: 70, required: false })
    @IsOptional()
    @IsString()
    @MaxLength(70)
    cover?: string;

    @ApiProperty({ description: 'Author IDs', example: [1, 2], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Author, 'id', { message: 'errors.AUDIOBOOK.INVALID_AUTHORS' })
    authorsIds: number[];

    @ApiProperty({ description: 'Genre IDs', example: [1, 3], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Genre, 'id', { message: 'errors.AUDIOBOOK.INVALID_GENRES' })
    genresIds: number[];

    @ApiProperty({ description: 'Issuer/Publisher IDs', example: [1], type: [Number] })
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(Issuer, 'id', { message: 'errors.AUDIOBOOK.INVALID_ISSUERS' })
    issuersIds: number[];

    @ApiProperty({ description: 'File IDs (Audio files, PDFs, etc.)', example: [1, 2], type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @Exists(File, 'id', { message: 'errors.AUDIOBOOK.INVALID_FILES' })
    filesIds?: number[];
}