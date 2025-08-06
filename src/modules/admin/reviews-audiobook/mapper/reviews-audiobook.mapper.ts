import { ReviewsAudiobook } from 'src/databases/typeorm/entities';
import { ReviewsAudiobookResponseDto } from '../dto/response/reviews-audiobook.res.dto';
import { CreateReviewsAudiobookDto } from '../dto/request/create-reviews-audiobook.dto';
import { UpdateReviewsAudiobookDto } from '../dto/request/update-reviews-audiobook.dto';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

export class ReviewsAudiobookMapper {
  static toDto(entity: ReviewsAudiobook): ReviewsAudiobookResponseDto {
    const locale = currentLocale();
    return new ReviewsAudiobookResponseDto(
      entity.id,
      entity.name,
      entity.email,
      entity.ip,
      entity.rating,
      entity.review,
      entity.status,
      entity.createdAt,
      entity.audiobooksId,
      {
        id: entity.audiobook?.id,
        name: entity.audiobook?.[`name_${locale}`],
        description_short: entity.audiobook?.[`description_short_${locale}`],
        cover: entity.audiobook?.cover,
      },
      entity.userId,
      {
        id: entity.user?.id,
        name: entity.user?.name,
        lastName: entity.user?.lastName,
      },
    );
  }

  static toDtoList(
    entities: ReviewsAudiobook[],
  ): ReviewsAudiobookResponseDto[] {
    return entities.map(this.toDto);
  }

  static toEntityFromCreateDto(
    dto: CreateReviewsAudiobookDto,
  ): ReviewsAudiobook {
    const reviewsAudiobook = new ReviewsAudiobook();
    Object.assign(reviewsAudiobook, dto);
    return reviewsAudiobook;
  }

  static toEntityFromUpdateDto(
    dto: UpdateReviewsAudiobookDto,
    existingReview: ReviewsAudiobook,
  ): ReviewsAudiobook {
    return Object.assign(existingReview, dto);
  }
}
