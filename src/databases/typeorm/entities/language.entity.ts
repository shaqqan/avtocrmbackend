import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, BaseEntity } from 'typeorm';
import { Upload } from './upload.entity';

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

  @OneToOne(() => Upload, { nullable: true })
  @JoinColumn({ name: 'iconId' })
  icon: Upload;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 