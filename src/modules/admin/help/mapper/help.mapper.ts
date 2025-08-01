import { Help } from "src/databases/typeorm/entities";
import { HelpMultiLangResponseDto, HelpResponseDto } from "../dto/response/help.res.dto";
import { I18nContext } from "nestjs-i18n";
import { CreateHelpDto } from "../dto/request/create-help.dto";
import { UpdateHelpDto } from "../dto/request/update-help.dto";

export class HelpMapper {
    static toDto(entity: Help): HelpMultiLangResponseDto {
        return new HelpMultiLangResponseDto(
            entity.id,
            entity.name_uz,
            entity.name_ru,
            entity.name_en,
            entity.description_uz,
            entity.description_ru,
            entity.description_en,
            entity.createdAt
        );
    }

    static toDtoList(entities: Help[]): HelpResponseDto[] {
        const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return entities.map(entity => new HelpResponseDto(
            entity.id,
            entity[`name_${currentLocale}`],
            entity[`description_${currentLocale}`],
            entity.createdAt
        ));
    }

    static toEntityFromCreateDto(dto: CreateHelpDto): Help {
        const help = new Help();
        Object.assign(help, dto);
        return help;
    }

    static toEntityFromUpdateDto(dto: UpdateHelpDto, existingHelp: Help): Help {
        return Object.assign(existingHelp, dto);
    }
}