import { BaseEntity, Column, PrimaryGeneratedColumn, Entity, Unique, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Book } from "./book.entity";
import { AudioBook } from "./audio-book.entity";
import { User } from "./user.entity";

export enum ReviewsAudiobookStatus {
    NEW = 'new',
    ASSIGNED = 'assigned',
    APPROVED = 'approved',
}

export enum ReviewsAudiobookRating {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}

@Entity({ name: 'reviews_audiobooks' })
@Unique(['audiobooksId', 'email', 'ip'])
export class ReviewsAudiobook extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 50,
        comment: 'string. Имя отправителя отзыва',
    })
    name: string;

    @Column()
    audiobooksId: number;

    @ManyToOne(() => AudioBook, (book) => book.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'audiobooksId' })
    audiobook: AudioBook;

    @Column({
        type: 'char',
        length: 50,
        comment: 'почтовый адрес отправителя',
    })
    email: string;

    @Column({ type: 'char', length: 50 })
    ip: string;

    @Column({
        type: 'enum',
        enum: ReviewsAudiobookRating,
        comment: 'int. Оценка по 5-ти бальной шкале',
    })
    rating: ReviewsAudiobookRating;

    @Column({ type: 'text', comment: 'текстовый отзыв' })
    review: string;

    @Column({
        type: 'enum',
        enum: ReviewsAudiobookStatus,
        default: ReviewsAudiobookStatus.NEW,
        nullable: true,
    })
    status: ReviewsAudiobookStatus;

    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => User, (user) => user.reviewsAudiobook)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
