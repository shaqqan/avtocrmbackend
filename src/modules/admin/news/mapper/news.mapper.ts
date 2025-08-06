import { News } from 'src/databases/typeorm/entities';
import {
  NewsMultiResponseDto,
  NewsResponseDto,
} from '../dto/response/news.res.dto';
import { CreateNewsDto } from '../dto/request/create-news.dto';
import { UpdateNewsDto } from '../dto/request/update-news.dto';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

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
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: News[]): NewsResponseDto[] {
    const locale = currentLocale();
    return entities.map(
      (entity) =>
        new NewsResponseDto(
          entity.id,
          entity[`title_${locale}`],
          entity[`description_${locale}`],
          entity.cover,
          entity.status,
          entity.createdAt,
          entity.updatedAt,
        ),
    );
  }

  static toEntityFromCreateDto(dto: CreateNewsDto): News {
    const news = new News();
    Object.assign(news, dto);
    return news;
  }

  static toEntityFromUpdateDto(dto: UpdateNewsDto, existingNews: News): News {
    return Object.assign(existingNews, dto);
  }
}
