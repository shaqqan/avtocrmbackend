import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer PINFL (Personal Identification Number)',
    example: 12345678901234,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  pinfl: number;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(100, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  firstName?: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(100, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  lastName?: string;

  @ApiProperty({
    description: 'Customer middle name',
    example: 'Michael',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(100, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  middleName?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+998901234567',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(20, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Customer address',
    example: '123 Main Street, Tashkent, Uzbekistan',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  address?: string;
}
