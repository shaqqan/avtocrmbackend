import { Genre } from "src/databases/typeorm/entities";
import { GenreListResponseDto } from "../dto/response/genre.res.dto";
import { I18nContext } from "nestjs-i18n";

export class GenreListMapper {
    static toDto(entity: Genre): GenreListResponseDto {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return new GenreListResponseDto(
            entity.id,
            entity.parentId,
            entity[`name_${locale}`],
        );
    }

    static toDtoList(entities: Genre[]): GenreListResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }
}