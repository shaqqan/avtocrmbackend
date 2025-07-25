import { Book, BookLangEnum } from 'src/databases/typeorm/entities';
import { BookResponseDto } from '../dto/response/book.res.dto';
import { CreateBookDto } from '../dto/request/create-book.dto';
import { UpdateBookDto } from '../dto/request/update-book.dto';

export class BookMapper {
    static toDto(entity: Book, locale: BookLangEnum | string = BookLangEnum.UZ): BookResponseDto {
        return new BookResponseDto(
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
        );
    }

    static toEntityFromCreateDto(dto: CreateBookDto): Book {
        const book = new Book();
        Object.assign(book, dto);
        return book;
    }

    static toEntityFromUpdateDto(dto: UpdateBookDto, existingBook: Book): Book {
        return Object.assign(existingBook, dto);
    }

    static toDtoList(entities: Book[], locale: BookLangEnum | string): BookResponseDto[] {
        return entities.map(entity => this.toDto(entity, locale));
    }
}
