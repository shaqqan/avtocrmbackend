import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateFeedbacksThemeDto {
    @ApiProperty({ description: 'Feedback theme name in Uzbek', example: 'Texnik yordam', maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_uz: string;

    @ApiProperty({ description: 'Feedback theme name in Russian', example: 'Техническая поддержка', maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_ru: string;

    @ApiProperty({ description: 'Feedback theme name in English', example: 'Technical Support', maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name_en: string;
}
