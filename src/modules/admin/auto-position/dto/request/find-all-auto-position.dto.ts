import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max, IsString, IsEnum, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request/base-pagination.dto';

export class FindAllAutoPositionDto extends BasePaginationDto {
  @ApiPropertyOptional({
    description: 'Auto model ID to filter positions',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: i18nValidationMessage('errors.VALIDATION.IS_NUMBER') })
  autoModelId?: number;
}
