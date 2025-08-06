import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'feedbacks_themes' })
export class FeedbacksTheme extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name_uz: string;

  @Column({ type: 'varchar', length: 255 })
  name_ru: string;

  @Column({ type: 'varchar', length: 255 })
  name_en: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
