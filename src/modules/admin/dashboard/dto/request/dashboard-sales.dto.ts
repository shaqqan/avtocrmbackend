import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DashboardSalesDto {
  @ApiProperty({
    description: 'Start date for sales statistics (YYYY-MM-DD format)',
    example: '2024-01-01',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  startDate: string;

  @ApiProperty({
    description: 'End date for sales statistics (YYYY-MM-DD format)',
    example: '2024-12-31',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @IsDateString({}, {
    message: i18nValidationMessage('errors.VALIDATION.IS_DATE_STRING'),
  })
  endDate: string;
}
