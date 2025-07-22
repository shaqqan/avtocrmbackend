import { ApiProperty } from "@nestjs/swagger";
import { Language } from "@prisma/client";

export class FindOneLanguageResponseDto {
    @ApiProperty({
        description: 'The id of the language',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'The name of the language',
        example: 'English',
    })
    name: string;

    @ApiProperty({
        description: 'The locale of the language',
        example: 'en',
    })
    locale: string;

    @ApiProperty({
        description: 'The icon of the language',
        example: 'https://example.com/icon.png',
    })
    icon: string | null;

    @ApiProperty({
        description: 'The created at of the language',
        example: '2021-01-01',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'The updated at of the language',
        example: '2021-01-01',
    })
    updatedAt: Date;

    constructor(language) {
        this.id = language.id;
        this.name = language.name;
        this.locale = language.locale;
        this.createdAt = language.createdAt;
        this.icon = global.asset(language.icon?.path);
        this.updatedAt = language.updatedAt;
    }
}       