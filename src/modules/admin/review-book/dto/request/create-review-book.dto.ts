import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import {
  RatingEnum,
  ReviewStatus,
} from 'src/databases/typeorm/entities/review-book.entity';

export class CreateReviewBookDto {
  @ApiProperty({
    description: 'Reviewer name',
    example: 'John Doe',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'Book ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  booksId: number;

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
    example: RatingEnum.FIVE,
    enum: RatingEnum,
  })
  @IsEnum(RatingEnum)
  @IsNotEmpty()
  rating: RatingEnum;

  @ApiProperty({
    description: 'Review text',
    example: 'Great book! Highly recommended.',
  })
  @IsString()
  @IsNotEmpty()
  review: string;

  @ApiProperty({
    description: 'Review status',
    example: ReviewStatus.NEW,
    enum: ReviewStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}
