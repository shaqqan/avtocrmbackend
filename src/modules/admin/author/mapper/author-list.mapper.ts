import { Author } from "src/databases/typeorm/entities";
import { AuthorListResponseDto, AuthorResponseDto, AuthorResponseWithMultiLangDto } from "../dto/response/author.res.dto";
import { I18nContext } from "nestjs-i18n";

export class AuthorListMapper {
    static toDto(author: Author): AuthorListResponseDto {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return new AuthorListResponseDto(
            author.id,
            author[`name_${locale}`],
            author[`lastName_${locale}`],
            author[`middleName_${locale}`],
        );
    }
    static toDtoList(authors: Author[]): AuthorListResponseDto[] {
        return authors.map(author => this.toDto(author));
    }
}