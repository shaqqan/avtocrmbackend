import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FileCategory, FileFormat } from 'src/common/enums';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;

  @ApiProperty({
    enum: FileCategory,
    description: 'File category',
    example: FileCategory.EBOOK,
  })
  @IsEnum(FileCategory)
  category: FileCategory;

  @ApiProperty({
    enum: FileFormat,
    description: 'File format',
    example: FileFormat.PDF,
  })
  @IsEnum(FileFormat)
  format: FileFormat;

  @ApiProperty({
    required: false,
    description: 'Title in Uzbek',
    example: 'Kitob nomi',
  })
  @IsOptional()
  @IsString()
  titleUz?: string;

  @ApiProperty({
    required: false,
    description: 'Title in Russian',
    example: 'Название книги',
  })
  @IsOptional()
  @IsString()
  titleRu?: string;

  @ApiProperty({
    required: false,
    description: 'Title in English',
    example: 'Book title',
  })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiProperty({
    required: false,
    description: 'Chapter number',
    example: 1,
    minimum: 0,
    maximum: 9999,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999)
  chapter?: number;

  @ApiProperty({
    required: false,
    description: 'Duration in seconds (for audio files)',
    example: 3600,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({
    required: false,
    description: 'Language code (3 characters)',
    example: 'uzb',
    minLength: 3,
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  @MinLength(3)
  @MaxLength(3)
  lang?: string;

  @ApiProperty({
    required: false,
    description: 'Whether the file is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  isActive?: boolean;
}
