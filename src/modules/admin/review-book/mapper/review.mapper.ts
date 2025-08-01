import { ReviewBook } from "src/databases/typeorm/entities";
import { ReviewBookResponseDto } from "../dto/response/review-book.res.dto";
import { CreateReviewBookDto } from "../dto/request/create-review-book.dto";
import { UpdateReviewBookDto } from "../dto/request/update-review-book.dto";
import { I18nContext } from "nestjs-i18n";

export class ReviewMapper {
    static toDto(entity: ReviewBook): ReviewBookResponseDto {
        const currentLocale = I18nContext.current()?.lang?.split('-')[0] || 'uz';
        return new ReviewBookResponseDto(
            entity.id,
            entity.name,
            entity.email,
            entity.ip,
            entity.rating,
            entity.review,
            entity.status,
            entity.createdAt,
            entity.booksId,
            {
                id: entity.book?.id,
                name: entity.book?.[`name_${currentLocale}`],
                description_short: entity.book?.[`description_short_${currentLocale}`],
                cover: entity.book?.cover,
            },
            entity.usersId,
            {
                id: entity.user?.id,
                name: entity.user?.name,
                lastName: entity.user?.lastName,
            },
        );
    }

    static toDtoList(entities: ReviewBook[]): ReviewBookResponseDto[] {
        return entities.map(this.toDto);
    }

    static toEntityFromCreateDto(dto: CreateReviewBookDto): ReviewBook {
        const reviewBook = new ReviewBook();
        Object.assign(reviewBook, dto);
        return reviewBook;
    }

    static toEntityFromUpdateDto(dto: UpdateReviewBookDto, existingReviewBook: ReviewBook): ReviewBook {
        return Object.assign(existingReviewBook, dto);
    }
}