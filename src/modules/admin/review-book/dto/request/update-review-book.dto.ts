import { PartialType } from '@nestjs/swagger';
import { CreateReviewBookDto } from './create-review-book.dto';

export class UpdateReviewBookDto extends PartialType(CreateReviewBookDto) {}
