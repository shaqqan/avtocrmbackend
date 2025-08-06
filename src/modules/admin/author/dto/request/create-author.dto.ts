import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'Author name in Uzbek',
    example: 'John',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name_uz: string;

  @ApiProperty({
    description: 'Author name in Russian',
    example: 'John',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name_ru: string;

  @ApiProperty({
    description: 'Author name in English',
    example: 'John',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name_en: string;

  @ApiProperty({
    description: 'Author last name in Uzbek',
    example: 'Doe',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName_uz: string;

  @ApiProperty({
    description: 'Author last name in Russian',
    example: 'Doe',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName_ru: string;

  @ApiProperty({
    description: 'Author last name in English',
    example: 'Doe',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName_en: string;

  @ApiProperty({
    description: 'Author middle name in Uzbek',
    example: 'John',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  middleName_uz?: string;

  @ApiProperty({
    description: 'Author middle name in Russian',
    example: 'John',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  middleName_ru?: string;

  @ApiProperty({
    description: 'Author middle name in English',
    example: 'John',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  middleName_en?: string;

  @ApiProperty({
    description: 'Author description in Uzbek',
    example: 'John Doe is a writer',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  description_uz: string;

  @ApiProperty({
    description: 'Author description in Russian',
    example: 'John Doe is a writer',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  description_ru: string;

  @ApiProperty({
    description: 'Author description in English',
    example: 'John Doe is a writer',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  description_en: string;

  @ApiProperty({
    description: 'Author cover',
    example: 'storage/covers/cover.jpg',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cover?: string;
}
