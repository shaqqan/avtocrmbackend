import { Author } from "src/databases/typeorm/entities";
import { AuthorResponseDto, AuthorResponseWithMultiLangDto } from "../dto/response/author.res.dto";
import { CreateAuthorDto } from "../dto/request/create-author.dto";
import { UpdateAuthorDto } from "../dto/request/update-author.dto";

export class AuthorMapper {
    static toDto(author: Author): AuthorResponseWithMultiLangDto {
        return new AuthorResponseWithMultiLangDto(
            author.id,
            author.name_uz,
            author.lastName_uz,
            author.middleName_uz,
            author.name_ru,
            author.lastName_ru,
            author.middleName_ru,
            author.name_en,
            author.lastName_en,
            author.middleName_en,
            author.description_uz,
            author.description_ru,
            author.description_en,
            author.cover,
            author.createdAt,
            author.updatedAt,
        );
    }
    static toDtoList(authors: Author[]): AuthorResponseDto[] {
        return authors.map(author => (
            new AuthorResponseDto(
                author.id,
                author.getName('uz'),
                author.getLastName('uz'),
                author.getMiddleName('uz'),
                author.getDescription('uz'),
                author.cover,
                author.createdAt,
                author.updatedAt,
            )
        ));
    }

    static toEntityFromCreateDto(dto: CreateAuthorDto): Author {
        const author = new Author();
        Object.assign(author, dto);
        return author;
    }

    static toEntityFromUpdateDto(dto: UpdateAuthorDto, existingAuthor: Author): Author {
        return Object.assign(existingAuthor, dto);
    }
}