import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, MaxLength, IsDate } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { StockStatus } from 'src/databases/typeorm/entities';

export class CreateStockDto {
  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  warehouseId: number;

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
    description: 'Body number (VIN or chassis number)',
    example: '1HGBH41JXMN109186',
    maxLength: 50,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @MaxLength(50, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  bodyNumber: string;

  @ApiProperty({
    description: 'Arrival date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDate()
  arrivalDate?: Date;

  @ApiProperty({
    description: 'Stock status',
    enum: StockStatus,
    example: StockStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  status?: StockStatus;
}
