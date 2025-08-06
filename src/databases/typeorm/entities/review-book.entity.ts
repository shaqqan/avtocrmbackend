import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from './user.entity';

export enum RatingEnum {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
}

export enum ReviewStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  APPROVED = 'approved',
}

@Entity({ name: 'reviews_books' })
@Unique(['booksId', 'email', 'ip'])
export class ReviewBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'string. Имя отправителя отзыва',
  })
  name: string;

  @Column()
  booksId: number;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booksId' })
  book: Book;

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
    enum: RatingEnum,
    comment: 'int. Оценка по 5-ти бальной шкале',
  })
  rating: RatingEnum;

  @Column({ type: 'text', comment: 'текстовый отзыв' })
  review: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.NEW,
    nullable: true,
  })
  status: ReviewStatus;

  @Column({ nullable: true })
  usersId: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'usersId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
