import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";
import { Exists } from "src/common/decorators/validators";
import { Genre } from "src/databases/typeorm/entities";

export class CreateGenreDto {
    @ApiProperty({ description: 'Parent genre ID', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Exists(Genre, 'id', { message: 'errors.PARENT_GENRE_NOT_FOUND' })
    parentId?: number;

    @ApiProperty({ description: 'Genre cover image path', example: 'storage/covers/genre.jpg', required: false })
    @IsOptional()
    @IsString()
    cover?: string;

    @ApiProperty({ description: 'Genre name in Uzbek', example: 'Fantastika', required: false })
    @IsOptional()
    @IsString()
    name_uz?: string;

    @ApiProperty({ description: 'Genre name in Russian', example: 'Фантастика', required: false })
    @IsOptional()
    @IsString()
    name_ru?: string;

    @ApiProperty({ description: 'Genre name in English', example: 'Fantasy', required: false })
    @IsOptional()
    @IsString()
    name_en?: string;

    @ApiProperty({ description: 'Genre description in Uzbek', example: 'Fantastika janri haqida', required: false })
    @IsOptional()
    @IsString()
    description_uz?: string;

    @ApiProperty({ description: 'Genre description in Russian', example: 'О жанре фантастика', required: false })
    @IsOptional()
    @IsString()
    description_ru?: string;

    @ApiProperty({ description: 'Genre description in English', example: 'About fantasy genre', required: false })
    @IsOptional()
    @IsString()
    description_en?: string;
}
