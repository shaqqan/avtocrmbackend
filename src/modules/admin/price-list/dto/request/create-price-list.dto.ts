import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsBoolean, Min, Max } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePriceListDto {
  @ApiProperty({
    description: 'Auto model ID',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  autoModelId: number;

  @ApiProperty({
    description: 'Auto color ID',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  autoColorId: number;

  @ApiProperty({
    description: 'Auto position ID',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  autoPositionId: number;

  @ApiProperty({
    description: 'Base price',
    example: 20000.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  basePrice?: number;

  @ApiProperty({
    description: 'Wholesale price',
    example: 22000.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  wholesalePrice?: number;

  @ApiProperty({
    description: 'Retail price',
    example: 25000.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  retailPrice?: number;

  @ApiProperty({
    description: 'VAT amount',
    example: 5000.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  vat?: number;

  @ApiProperty({
    description: 'Margin amount',
    example: 3000.00,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  margin?: number;

  @ApiProperty({
    description: 'Valid from date',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  validFrom?: string;

  @ApiProperty({
    description: 'Valid to date',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  validTo?: string;

  @ApiProperty({
    description: 'Is active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('errors.VALIDATION.IS_BOOLEAN'),
  })
  isActive?: boolean;
}
