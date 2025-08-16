import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDateString, IsBoolean, Min, Max } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { OrderState } from 'src/databases/typeorm/entities';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  customerId: number;

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
    description: 'Contract code (unique)',
    example: 'CONTRACT-2024-001',
    maxLength: 100,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  contractCode: string;

  @ApiProperty({
    description: 'Order state',
    enum: OrderState,
    example: OrderState.NEW,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderState, {
    message: i18nValidationMessage('errors.VALIDATION.IS_ENUM'),
  })
  state?: OrderState;

  @ApiProperty({
    description: 'Queue number',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(1, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  queueNumber: number;

  @ApiProperty({
    description: 'Amount due',
    example: 5000.00,
    minimum: 0,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  amountDue: number;

  @ApiProperty({
    description: 'Order date',
    example: '2024-01-15',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  orderDate: string;

  @ApiProperty({
    description: 'Price',
    example: 25000.00,
    minimum: 0,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  price: number;

  @ApiProperty({
    description: 'Expected delivery date',
    example: '2024-03-15',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  expectedDeliveryDate: string;

  @ApiProperty({
    description: 'Status changed at timestamp',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  statusChangedAt?: string;

  @ApiProperty({
    description: 'Frozen status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage('errors.VALIDATION.IS_BOOLEAN'),
  })
  frozen?: boolean;

  @ApiProperty({
    description: 'Paid percentage (0-100)',
    example: 25.5,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  @Min(0, {
    message: i18nValidationMessage('errors.VALIDATION.MIN'),
  })
  @Max(100, {
    message: i18nValidationMessage('errors.VALIDATION.MAX'),
  })
  paidPercentage?: number;

  @ApiProperty({
    description: 'Client table ID',
    example: 123,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER'),
  })
  client_table_id?: number;
}
