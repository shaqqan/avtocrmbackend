import { ApiProperty } from '@nestjs/swagger';
import { File } from 'src/databases/typeorm/entities';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Exists } from 'src/common/decorators/validators';
import { IsLocale, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLanguageDto {
    @ApiProperty({
        description: 'The name of the language',
        example: 'English',
    })
    @IsOptional()
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    name: string;

    @ApiProperty({
        description: 'The locale of the language',
        example: 'en',
    })
    @IsOptional()
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @IsLocale({ message: i18nValidationMessage('validation.IS_LOCALE') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    locale: string;

    @ApiProperty({
        description: 'The icon id of the language',
        example: 1,
    })
    @IsOptional()
    @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    @Exists(File, 'id', { message: i18nValidationMessage('validation.FILE_NOT_FOUND') })
    iconId: number;
}
