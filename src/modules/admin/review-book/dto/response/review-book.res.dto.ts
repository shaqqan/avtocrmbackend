import { RatingEnum, ReviewStatus } from "src/databases/typeorm/entities";

export class ReviewBookResponseDto {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public ip: string,
        public rating: RatingEnum,
        public review: string,
        public status: ReviewStatus,
        public createdAt: Date,
        public booksId: number,
        public book: {
            id: number,
            name: string,
            description_short: string,
            cover: string,
        },
        public usersId: number,
        public user: {
            id: number,
            name: string,
            lastName: string,
        },
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.ip = ip;
        this.rating = rating;
        this.review = review;
        this.status = status;
        this.booksId = booksId;
        this.book = book;
        this.usersId = usersId;
        this.user = user;
        this.createdAt = createdAt;
    }
}