import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Distribution Center',
    maxLength: 100,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(100, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  name: string;

  @ApiProperty({
    description: 'Warehouse address',
    example: '123 Industrial Blvd, City, State 12345',
    maxLength: 255,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  address: string;

  @ApiProperty({
    description: 'Warehouse location coordinates (point format)',
    example: '(41.2995,69.2401)',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  location?: string;
}
