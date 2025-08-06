import { Genre } from 'src/databases/typeorm/entities';
import {
  GenreResponseDto,
  GenreResponseMultiLangDto,
} from '../dto/response/genre.res.dto';
import { I18nContext } from 'nestjs-i18n';
import { CreateGenreDto } from '../dto/request/create-genre.dto';
import { UpdateGenreDto } from '../dto/request/update-genre.dto';
import { currentLocale } from 'src/common/utils';

export class GenreMapper {
  static toDto(entity: Genre): GenreResponseMultiLangDto {
    return new GenreResponseMultiLangDto(
      entity.id,
      entity.parentId,
      entity.cover,
      entity.name_uz,
      entity.name_ru,
      entity.name_en,
      entity.description_uz,
      entity.description_ru,
      entity.description_en,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: Genre[]): GenreResponseDto[] {
    const locale = currentLocale();
    return entities.map(
      (entity) =>
        new GenreResponseDto(
          entity.id,
          entity.parentId,
          entity.cover,
          entity[`name_${locale}`],
          entity[`description_${locale}`],
          entity.createdAt,
          entity.updatedAt,
          entity.children?.map(
            (child) =>
              new GenreResponseDto(
                child.id,
                child.parentId,
                child.cover,
                child[`name_${locale}`],
                child[`description_${locale}`],
                child.createdAt,
                child.updatedAt,
              ),
          ),
        ),
    );
  }

  static toEntityFromCreateDto(dto: CreateGenreDto): Genre {
    const genre = new Genre();
    Object.assign(genre, dto);
    return genre;
  }

  static toEntityFromUpdateDto(
    dto: UpdateGenreDto,
    existingGenre: Genre,
  ): Genre {
    return Object.assign(existingGenre, dto);
  }
}
