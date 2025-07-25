import { Language } from "src/databases/typeorm/entities";
import { LanguageResponseDto } from "../dto/response/language.res.dto";
import { CreateLanguageDto } from "../dto/request/create-language.dto";
import { UpdateLanguageDto } from "../dto/request/update-language.dto";

export class LanguageMapper {
    static toDto(entity: Language): LanguageResponseDto {
        const url = entity.icon?.path ? global.asset(entity.icon.path) : null;
        return new LanguageResponseDto(
            entity.id,
            entity.name,
            entity.locale,
            url,
            entity.createdAt,
            entity.updatedAt
        );
    }

    static toEntityFromCreateDto(dto: CreateLanguageDto): Language {
        const language = new Language();
        Object.assign(language, dto);
        return language;
    }

    static toEntityFromUpdateDto(dto: UpdateLanguageDto, existingLanguage: Language): Language {
        return Object.assign(existingLanguage, dto);
    }

    static toDtoList(entities: Language[]): LanguageResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }
}