import { ApiProperty } from "@nestjs/swagger";
import { IsLocale, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { Exists, AlreadyExists } from "src/common/decorators/validators";
import { Language, File } from "src/databases/typeorm/entities";

export class CreateLanguageDto {

    @ApiProperty({
        description: 'The name of the language',
        example: 'Beka',
        maxLength: 255,
    })
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    @AlreadyExists(Language, 'name', { message: i18nValidationMessage('validation.ALREADY_EXISTS') })
    name: string;

    @ApiProperty({
        description: 'The locale of the language',
        example: 'en',
    })
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @IsLocale({ message: i18nValidationMessage('validation.IS_LOCALE') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    @AlreadyExists(Language, 'locale', { message: i18nValidationMessage('validation.ALREADY_EXISTS') })
    locale: string;

    @ApiProperty({
        description: 'The icon id of the language',
        example: 1,
    })
    @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    @Exists(File, 'id', { message: i18nValidationMessage('validation.FILE_NOT_FOUND') })
    iconId: number;
}
