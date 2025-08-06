import {
  ReviewsAudiobookRating,
  ReviewsAudiobookStatus,
} from 'src/databases/typeorm/entities';

export class ReviewsAudiobookResponseDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public ip: string,
    public rating: ReviewsAudiobookRating,
    public review: string,
    public status: ReviewsAudiobookStatus,
    public createdAt: Date,
    public audiobooksId: number,
    public audiobook: {
      id: number;
      name: string;
      description_short: string;
      cover: string;
    },
    public usersId: number,
    public user: {
      id: number;
      name: string;
      lastName: string;
    },
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.ip = ip;
    this.rating = rating;
    this.review = review;
    this.status = status;
    this.audiobooksId = audiobooksId;
    this.usersId = usersId;
    this.user = user;
    this.createdAt = createdAt;
  }
}
