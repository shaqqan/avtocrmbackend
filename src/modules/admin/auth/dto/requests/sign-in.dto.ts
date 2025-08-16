import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInDto {
  @IsPhoneNumber(
    'UZ',
    {
      message: i18nValidationMessage('errors.VALIDATION.IS_PHONE_NUMBER'),
    },
  )
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+998912672434',
  })
  phone: string;

  @IsString({
    message: i18nValidationMessage('errors.VALIDATION.IS_STRING'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('errors.VALIDATION.NOT_EMPTY'),
  })
  @MinLength(6, {
    message: i18nValidationMessage('errors.VALIDATION.MIN_LENGTH'),
  })
  @MaxLength(255, {
    message: i18nValidationMessage('errors.VALIDATION.MAX_LENGTH'),
  })
  @ApiProperty({
    description: 'The password of the user',
    example: '^6CX0KwS57<MCZ5n',
  })
  password: string;
}
