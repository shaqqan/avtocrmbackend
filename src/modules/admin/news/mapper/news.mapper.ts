import { News } from "src/databases/typeorm/entities";
import { NewsMultiResponseDto, NewsResponseDto } from "../dto/response/news.res.dto";
import { I18nContext } from "nestjs-i18n";

export class NewsMapper {
    static toDto(entity: News): NewsMultiResponseDto {
        return new NewsMultiResponseDto(
            entity.id,
            entity.title_uz,
            entity.title_ru,
            entity.title_en,
            entity.description_uz,
            entity.description_ru,
            entity.description_en,
            entity.cover,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toDtoList(entities: News[]): NewsResponseDto[] {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return entities.map(entity => new NewsResponseDto(
            entity.id,
            entity[`title_${locale}`],
            entity[`description_${locale}`],
            entity.cover,
            entity.createdAt,
            entity.updatedAt,
        ));
    }
}