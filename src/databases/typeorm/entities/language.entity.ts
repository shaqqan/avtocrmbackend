import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { File } from './file.entity';
@Entity('languages')
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  locale: string;

  @Column({ nullable: true })
  iconId: number;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'iconId' })
  icon: File;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
