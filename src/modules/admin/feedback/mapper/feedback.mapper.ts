import { Feedback } from 'src/databases/typeorm/entities';
import { FeedbackResponseDto } from '../dto/response/feedback-response.dto';
import { I18nContext } from 'nestjs-i18n';
import { CreateFeedbackDto } from '../dto/request/create-feedback.dto';
import { currentLocale } from 'src/common/utils';

export class FeedbackMapper {
  static toEntityFromCreateDto(createFeedbackDto: CreateFeedbackDto): any {
    throw new Error('Method not implemented.');
  }
  static toDto(entity: Feedback): FeedbackResponseDto {
    const locale = currentLocale();
    return new FeedbackResponseDto(
      entity.id,
      entity.name,
      entity.email,
      entity.ip,
      entity.message,
      entity.createdAt,
      entity.feedbacksThemeId,
      {
        id: entity.feedbacksThemeId,
        name: entity.feedbacksTheme[`name_${locale}`],
      },
    );
  }

  static toDtoList(entities: Feedback[]): FeedbackResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
