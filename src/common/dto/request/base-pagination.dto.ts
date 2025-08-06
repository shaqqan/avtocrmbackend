import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max, IsString, IsEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class BasePaginationDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('errors.VALIDATION.IS_INT') })
  @Min(1, { message: i18nValidationMessage('errors.VALIDATION.MIN') })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of elements per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('errors.VALIDATION.IS_INT') })
  @Min(1, { message: i18nValidationMessage('errors.VALIDATION.MIN') })
  @Max(100, { message: i18nValidationMessage('errors.VALIDATION.MAX') })
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Search text',
    example: 'test',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.VALIDATION.IS_STRING') })
  search?: string;

  @ApiPropertyOptional({
    description: 'Sorting field name',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.VALIDATION.IS_STRING') })
  sortBy: string = 'id';

  @ApiPropertyOptional({
    description: 'Sorting order',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder, {
    message: i18nValidationMessage('errors.VALIDATION.IS_ENUM'),
  })
  sortOrder: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Filters',
    example: {
      name: 'John',
    },
  })
  filters?: Record<string, any>;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }

  get take(): number {
    return this.limit || 10;
  }
}
