import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  BaseEntity,
  AfterLoad,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { ReviewBook } from './review-book.entity';
import { ReviewsAudiobook } from './reviews-audiobook.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => ReviewBook, (review) => review.user)
  reviews: ReviewBook[];

  @OneToMany(() => ReviewsAudiobook, (review) => review.user)
  reviewsAudiobook: ReviewsAudiobook[];
}
