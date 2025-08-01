import { IsString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ReviewsAudiobookRating, ReviewsAudiobookStatus } from 'src/databases/typeorm/entities';

export class CreateReviewsAudiobookDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    booksId: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    ip: string;

    @IsEnum(ReviewsAudiobookRating)
    @IsNotEmpty()
    rating: ReviewsAudiobookRating;

    @IsString()
    @IsNotEmpty()
    review: string;

    @IsEnum(ReviewsAudiobookStatus)
    @IsOptional()
    status?: ReviewsAudiobookStatus;

    @IsNumber()
    @IsOptional()
    usersId?: number;
}
