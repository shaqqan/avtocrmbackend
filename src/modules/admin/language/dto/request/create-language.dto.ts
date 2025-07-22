import { ApiProperty } from "@nestjs/swagger";
import { IsLocale, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateLanguageDto {

    @ApiProperty({
        description: 'The name of the language',
        example: 'English',
    })
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    name: string;

    @ApiProperty({
        description: 'The locale of the language',
        example: 'en',
    })
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @IsLocale({ message: i18nValidationMessage('validation.IS_LOCALE') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    locale: string;

    @ApiProperty({
        description: 'The icon id of the language',
        example: 1,
    })
    @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    iconId: number;
}
