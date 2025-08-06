import {
  BookAudiobookLink,
  LinkStatusEnum,
  LinkTypeEnum,
} from '../../../../databases/typeorm/entities/book-audiobook-link.entity';
import { CreateBookAudiobookLinkDto } from '../dto/request/create-book-audiobook-link.dto';
import { UpdateBookAudiobookLinkDto } from '../dto/request/update-book-audiobook-link.dto';
import {
  BookAudiobookLinkResponseDto,
  BookAudiobookLinkSummaryDto,
} from '../dto/response/book-audiobook-link.res.dto';

export class BookAudiobookLinkMapper {
  static toDto(entity: BookAudiobookLink): BookAudiobookLinkResponseDto {
    return new BookAudiobookLinkResponseDto(
      entity.id,
      entity.bookId,
      entity.audiobookId,
      entity.linkType,
      entity.status,
      entity.description,
      entity.priority,
      entity.createdAt,
      entity.updatedAt,
      entity.book && {
        id: entity.book.id,
        name_uz: entity.book.name_uz,
        name_ru: entity.book.name_ru,
        name_en: entity.book.name_en,
        cover: entity.book.cover,
        year: entity.book.year,
        published: entity.book.published,
      },
      entity.audiobook && {
        id: entity.audiobook.id,
        name_uz: entity.audiobook.name_uz,
        name_ru: entity.audiobook.name_ru,
        name_en: entity.audiobook.name_en,
        cover: entity.audiobook.cover,
        year: entity.audiobook.year,
        published: entity.audiobook.published,
        duration: entity.audiobook.duration,
      },
    );
  }

  static toSummaryDto(
    entity: BookAudiobookLink,
    locale: 'uz' | 'ru' | 'en' = 'uz',
  ): BookAudiobookLinkSummaryDto {
    const bookName = entity.book
      ? entity.book.getName(locale)
      : `Book #${entity.bookId}`;

    const audiobookName = entity.audiobook
      ? entity.audiobook.getName(locale)
      : `AudioBook #${entity.audiobookId}`;

    return new BookAudiobookLinkSummaryDto(
      entity.id,
      entity.bookId,
      entity.audiobookId,
      entity.linkType,
      entity.status,
      entity.priority,
      bookName,
      audiobookName,
      entity.createdAt,
    );
  }

  static toDtoList(
    entities: BookAudiobookLink[],
  ): BookAudiobookLinkResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toSummaryDtoList(
    entities: BookAudiobookLink[],
    locale: 'uz' | 'ru' | 'en' = 'uz',
  ): BookAudiobookLinkSummaryDto[] {
    return entities.map((entity) => this.toSummaryDto(entity, locale));
  }

  static toEntityFromCreateDto(
    dto: CreateBookAudiobookLinkDto,
  ): BookAudiobookLink {
    const entity = new BookAudiobookLink();
    entity.bookId = dto.bookId;
    entity.audiobookId = dto.audiobookId;
    entity.linkType = dto.linkType || LinkTypeEnum.SAME_CONTENT;
    entity.status = dto.status || LinkStatusEnum.ACTIVE;
    entity.description = dto.description || '';
    entity.priority = dto.priority || 0;
    return entity;
  }

  static toEntityFromUpdateDto(
    dto: UpdateBookAudiobookLinkDto,
    existingLink: BookAudiobookLink,
  ): BookAudiobookLink {
    if (dto.bookId !== undefined) existingLink.bookId = dto.bookId;
    if (dto.audiobookId !== undefined)
      existingLink.audiobookId = dto.audiobookId;
    if (dto.linkType !== undefined) existingLink.linkType = dto.linkType;
    if (dto.status !== undefined) existingLink.status = dto.status;
    if (dto.description !== undefined)
      existingLink.description = dto.description;
    if (dto.priority !== undefined) existingLink.priority = dto.priority;
    return existingLink;
  }
}
