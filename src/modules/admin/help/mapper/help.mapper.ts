import { Help } from "src/databases/typeorm/entities";
import { HelpResponseDto } from "../dto/response/help.res.dto";
import { I18nContext } from "nestjs-i18n";
import { CreateHelpDto } from "../dto/request/create-help.dto";

export class HelpMapper {
    static toDto(entity: Help): HelpResponseDto {
        const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return new HelpResponseDto(
            entity.id,
            entity[`name_${currentLocale}`],
            entity[`description_${currentLocale}`],
            entity.createdAt
        );
    }

    static toDtoList(entities: Help[]): HelpResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }

    static toEntityFromCreateDto(dto: CreateHelpDto): Help {
        const help = new Help();
        Object.assign(help, dto);
        return help;
    }
}