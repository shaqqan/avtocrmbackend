import { PartialType } from '@nestjs/swagger';
import { CreateReviewsAudiobookDto } from './create-reviews-audiobook.dto';

export class UpdateReviewsAudiobookDto extends PartialType(
  CreateReviewsAudiobookDto,
) {}
