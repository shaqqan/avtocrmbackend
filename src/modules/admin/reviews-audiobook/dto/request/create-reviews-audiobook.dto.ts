import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import {
  ReviewsAudiobookRating,
  ReviewsAudiobookStatus,
} from 'src/databases/typeorm/entities';

export class CreateReviewsAudiobookDto {
  @ApiProperty({
    description: 'Reviewer name',
    example: 'John Doe',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'AudioBook ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  audiobooksId: number;

  @ApiProperty({
    description: 'Reviewer email',
    example: 'john.doe@example.com',
    maxLength: 50,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'IP address',
    example: '192.168.1.1',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ip: string;

  @ApiProperty({
    description: 'Rating (1-5)',
    example: ReviewsAudiobookRating.FIVE,
    enum: ReviewsAudiobookRating,
  })
  @IsEnum(ReviewsAudiobookRating)
  @IsNotEmpty()
  rating: ReviewsAudiobookRating;

  @ApiProperty({
    description: 'Review text',
    example: 'Great audiobook! Excellent narration.',
  })
  @IsString()
  @IsNotEmpty()
  review: string;

  @ApiProperty({
    description: 'Review status',
    example: ReviewsAudiobookStatus.NEW,
    enum: ReviewsAudiobookStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReviewsAudiobookStatus)
  status?: ReviewsAudiobookStatus;

  @ApiProperty({
    description: 'User ID (if logged in)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
