import { Book, BookLangEnum } from 'src/databases/typeorm/entities';
import {
  BookResponseDto,
  BookResponseMultiLangDto,
} from '../dto/response/book.res.dto';
import { CreateBookDto } from '../dto/request/create-book.dto';
import { UpdateBookDto } from '../dto/request/update-book.dto';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

export class BookMapper {
  static toDto(entity: Book): BookResponseMultiLangDto {
    const locale = currentLocale();
    return new BookResponseMultiLangDto(
      entity.id,
      entity.name_uz,
      entity.name_ru,
      entity.name_en,
      entity.description_uz,
      entity.description_ru,
      entity.description_en,
      entity.description_short_uz,
      entity.description_short_ru,
      entity.description_short_en,
      entity.lang,
      entity.ISBN,
      entity.top,
      entity.cover,
      entity.year,
      entity.pages,
      entity.published,
      entity.createdAt,
      entity.authors.map((author) => author[`name_${locale}`]),
      entity.files?.map((file) => file.name),
      entity.genres?.map((genre) => genre[`name_${locale}`]),
      entity.issuers?.map((issuer) => issuer[`name_${locale}`]),
    );
  }

  static toEntityFromCreateDto(dto: CreateBookDto): Book {
    const book = new Book();
    // Copy all properties except relationship IDs
    const { authorsIds, genresIds, issuersIds, filesIds, ...bookData } = dto;
    Object.assign(book, bookData);
    return book;
  }

  static toEntityFromUpdateDto(dto: UpdateBookDto, existingBook: Book): Book {
    // Copy all properties except relationship IDs
    const { authorsIds, genresIds, issuersIds, filesIds, ...bookData } = dto;
    return Object.assign(existingBook, bookData);
  }

  static toDtoList(entities: Book[]): BookResponseDto[] {
    const locale = currentLocale();
    return entities.map(
      (entity) =>
        new BookResponseDto(
          entity.id,
          entity.getName(locale),
          entity.getDescription(locale),
          entity.getDescriptionShort(locale),
          entity.lang,
          entity.ISBN,
          entity.top,
          entity.cover,
          entity.year,
          entity.pages,
          entity.published,
          entity.createdAt,
          entity.authors.map(
            (author) =>
              author[`name_${locale}`] +
              ' ' +
              author[`lastName_${locale}`] +
              ' ' +
              author[`middleName_${locale}`],
          ),
          entity.files?.map((file) => file.name),
          entity.genres?.map((genre) => genre[`name_${locale}`]),
          entity.issuers?.map((issuer) => issuer[`name_${locale}`]),
        ),
    );
  }
}
