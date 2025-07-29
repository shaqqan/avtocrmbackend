import { FileCategory, FileFormat } from 'src/common/enums';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, AfterLoad } from 'typeorm';

@Entity('files')
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  title_uz: string;

  @Column({ nullable: true })
  title_ru: string;

  @Column({ nullable: true })
  title_en: string;

  @Column({ type: 'enum', enum: FileFormat })
  format: FileFormat;

  @Column({ type: 'enum', enum: FileCategory })
  category: FileCategory;

  @Column({ type: 'smallint' })
  chapter: number;

  @Column({ type: 'char', length: 3 })
  lang: string;

  @Column({ type: 'int' })
  duration: number;

  @Column()
  size: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  setUrlName() {
    this.name = global.asset(this.name);
  }
} 