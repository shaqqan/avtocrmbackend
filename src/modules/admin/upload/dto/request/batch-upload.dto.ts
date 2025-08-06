import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FileCategory, FileFormat } from 'src/common/enums';

export class BatchFileItemDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;

  @ApiProperty({
    required: false,
    description: 'Chapter number (optional)',
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
    description: 'Duration in seconds for audio files (optional)',
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
    description: 'Language code (3 characters, optional)',
    example: 'uzb',
    minLength: 3,
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  lang?: string;

  @ApiProperty({
    required: false,
    description: 'Whether the file is active (optional)',
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

export class BatchUploadDto {
  @ApiProperty({
    enum: FileCategory,
    description: 'Default file category for organizing uploads',
    example: FileCategory.EBOOK,
  })
  @IsEnum(FileCategory)
  category: FileCategory;

  @ApiProperty({
    enum: FileFormat,
    description: 'Default file format',
    example: FileFormat.PDF,
  })
  @IsEnum(FileFormat)
  format: FileFormat;

  @ApiProperty({
    type: [BatchFileItemDto],
    description: 'Array of files with individual metadata',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchFileItemDto)
  files: BatchFileItemDto[];
}
