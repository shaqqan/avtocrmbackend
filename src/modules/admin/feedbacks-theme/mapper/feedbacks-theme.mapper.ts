import { FeedbacksTheme } from "src/databases/typeorm/entities";
import { FeedbacksThemeMultiLanguageResponseDto, FeedbacksThemeResponseDto } from "../dto/response/feedbacks-theme.res.dto";
import { CreateFeedbacksThemeDto } from "../dto/request/create-feedbacks-theme.dto";
import { UpdateFeedbacksThemeDto } from "../dto/request/update-feedbacks-theme.dto";
import { I18nContext } from "nestjs-i18n";

export class FeedbacksThemeMapper {
    static toDto(entity: FeedbacksTheme): FeedbacksThemeMultiLanguageResponseDto {
        return new FeedbacksThemeMultiLanguageResponseDto(
            entity.id,
            entity.name_uz,
            entity.name_ru,
            entity.name_en,
            entity.createdAt
        );
    }

    static toDtoList(entities: FeedbacksTheme[]): FeedbacksThemeResponseDto[] {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return entities.map(entity => new FeedbacksThemeResponseDto(
            entity.id,
            entity[`name_${locale}`],
            entity.createdAt
        ));
    }

    static toEntityFromCreateDto(dto: CreateFeedbacksThemeDto): FeedbacksTheme {
        const feedbacksTheme = new FeedbacksTheme();
        Object.assign(feedbacksTheme, dto);
        return feedbacksTheme;
    }

    static toEntityFromUpdateDto(dto: UpdateFeedbacksThemeDto, existingTheme: FeedbacksTheme): FeedbacksTheme {
        return Object.assign(existingTheme, dto);
    }
}