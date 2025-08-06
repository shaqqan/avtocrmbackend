import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Book } from './book.entity';
import { AudioBook } from './audio-book.entity';

export enum LinkTypeEnum {
  SAME_CONTENT = 'same_content', // Same exact content, different format
  ADAPTATION = 'adaptation', // Audiobook is an adaptation of the book
  RELATED = 'related', // Related but not identical content
}

export enum LinkStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('book_audiobook_links')
@Index(['bookId', 'audiobookId'], { unique: true })
export class BookAudiobookLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  bookId: number;

  @Column({ type: 'int' })
  audiobookId: number;

  @Column({
    type: 'enum',
    enum: LinkTypeEnum,
    default: LinkTypeEnum.SAME_CONTENT,
    comment: 'Type of relationship between book and audiobook',
  })
  linkType: LinkTypeEnum;

  @Column({
    type: 'enum',
    enum: LinkStatusEnum,
    default: LinkStatusEnum.ACTIVE,
    comment: 'Status of the link',
  })
  status: LinkStatusEnum;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Optional description of the relationship',
  })
  description: string;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: 'Order/priority of this link (0 = highest priority)',
  })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  // Relations
  @ManyToOne(() => Book, (book) => book.audiobookLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => AudioBook, (audiobook) => audiobook.bookLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audiobookId' })
  audiobook: AudioBook;
}
