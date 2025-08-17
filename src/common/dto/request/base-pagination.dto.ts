import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max, IsString, IsEnum, IsArray } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PaginateQuery } from 'nestjs-paginate';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BasePaginationDto implements PaginateQuery {
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
  page?: number = 1;

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
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search text',
    example: 'test',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.VALIDATION.IS_STRING') })
  search?: string;

  @ApiPropertyOptional({
    description: 'Sorting field and order in nestjs-paginate format',
    example: [['id', 'DESC'], ['name', 'ASC']],
    isArray: true,
  })
  @IsOptional()
  sortBy?: [string, string][];

  @ApiPropertyOptional({
    description: 'Filters',
    example: {
      'name': 'John',
      'age': '25',
    },
  })
  filter?: { [column: string]: string | string[] };

  @ApiPropertyOptional({
    description: 'Select specific fields',
    example: ['id', 'name', 'email'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: i18nValidationMessage('errors.VALIDATION.IS_STRING') })
  select?: string[];

  @ApiPropertyOptional({
    description: 'Path for nested pagination',
    example: 'users',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('errors.VALIDATION.IS_STRING') })
  path: string = '';

  // Legacy support - these getters maintain backward compatibility
  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }

  get take(): number {
    return this.limit || 10;
  }

  // Legacy support for old sortBy/sortOrder pattern
  get legacySortBy(): string {
    if (this.sortBy && this.sortBy.length > 0) {
      const [field] = this.sortBy[0];
      return field || 'id';
    }
    return 'id';
  }

  get legacySortOrder(): 'ASC' | 'DESC' {
    if (this.sortBy && this.sortBy.length > 0) {
      const [, order] = this.sortBy[0];
      return (order?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';
    }
    return 'DESC';
  }
}
