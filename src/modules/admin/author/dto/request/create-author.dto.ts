import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthorDto {
    @ApiProperty({ description: 'Author name in Uzbek', example: 'John' })
    @IsString()
    @IsNotEmpty()
    name_uz: string;

    @ApiProperty({ description: 'Author name in Russian', example: 'John' })
    @IsString()
    @IsNotEmpty()
    name_ru: string;

    @ApiProperty({ description: 'Author name in English', example: 'John' })
    @IsString()
    @IsNotEmpty()
    name_en: string;

    @ApiProperty({ description: 'Author last name in Uzbek', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName_uz: string;

    @ApiProperty({ description: 'Author last name in Russian', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName_ru: string;

    @ApiProperty({ description: 'Author last name in English', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName_en: string;

    @ApiProperty({ description: 'Author middle name in Uzbek', example: 'John' })
    @IsString()
    @IsNotEmpty()
    middleName_uz: string;

    @ApiProperty({ description: 'Author middle name in Russian', example: 'John' })
    @IsString()
    @IsNotEmpty()
    middleName_ru: string;

    @ApiProperty({ description: 'Author middle name in English', example: 'John' })
    @IsString()
    @IsNotEmpty() 
    middleName_en: string;

    @ApiProperty({ description: 'Author description in Uzbek', example: 'John Doe is a writer' })
    @IsString()
    @IsNotEmpty()
    description_uz: string;

    @ApiProperty({ description: 'Author description in Russian', example: 'John Doe is a writer' })
    @IsString()
    @IsNotEmpty()
    description_ru: string;

    @ApiProperty({ description: 'Author description in English', example: 'John Doe is a writer' })
    @IsString()
    @IsNotEmpty()
    description_en: string;

    @ApiProperty({ description: 'Author cover', example: 'storage/covers/cover.jpg' })
    @IsString()
    @IsNotEmpty()
    cover: string;

}
