import { PartialType } from '@nestjs/swagger';
import { CreateFeedbacksThemeDto } from './create-feedbacks-theme.dto';

export class UpdateFeedbacksThemeDto extends PartialType(
  CreateFeedbacksThemeDto,
) {}
