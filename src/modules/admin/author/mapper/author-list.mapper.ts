import { Author } from 'src/databases/typeorm/entities';
import {
  AuthorListResponseDto,
  AuthorResponseDto,
  AuthorResponseWithMultiLangDto,
} from '../dto/response/author.res.dto';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

export class AuthorListMapper {
  static toDto(author: Author): AuthorListResponseDto {
    const locale = currentLocale();
    return new AuthorListResponseDto(
      author.id,
      author.getFullName(locale),
    );
  }
  static toDtoList(authors: Author[]): AuthorListResponseDto[] {
    return authors.map((author) => this.toDto(author));
  }
}
