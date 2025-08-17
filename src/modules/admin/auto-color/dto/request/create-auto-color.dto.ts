import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateAutoColorDto {
  @ApiProperty({
    description: 'Auto color name',
    example: 'Metallic Silver',
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
}
