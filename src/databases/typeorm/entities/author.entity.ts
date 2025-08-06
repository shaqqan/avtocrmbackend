import {
  BaseEntity,
  BeforeInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { decodeHTML } from 'entities';

@Entity('authors')
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name_uz: string;

  @Column({ type: 'varchar', length: 50 })
  lastName_uz: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName_uz: string;

  @Column({ type: 'varchar', length: 50 })
  name_ru: string;

  @Column({ type: 'varchar', length: 50 })
  lastName_ru: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName_ru: string;

  @Column({ type: 'varchar', length: 50 })
  name_en: string;

  @Column({ type: 'varchar', length: 50 })
  lastName_en: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName_en: string;

  @Column({ type: 'varchar', length: 4000 })
  description_uz: string;

  @Column({ type: 'varchar', length: 4000 })
  description_ru: string;

  @Column({ type: 'varchar', length: 4000 })
  description_en: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cover: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date;

  @AfterLoad()
  setUrlCover() {
    this.cover = global.asset(this.cover);
  }

  @AfterLoad()
  decodeName() {
    this.name_uz = this.name_uz ? decodeHTML(this.name_uz) : this.name_uz;
    this.lastName_uz = this.lastName_uz
      ? decodeHTML(this.lastName_uz)
      : this.lastName_uz;
    this.middleName_uz = this.middleName_uz
      ? decodeHTML(this.middleName_uz)
      : this.middleName_uz;
    this.name_ru = this.name_ru ? decodeHTML(this.name_ru) : this.name_ru;
    this.lastName_ru = this.lastName_ru
      ? decodeHTML(this.lastName_ru)
      : this.lastName_ru;
    this.middleName_ru = this.middleName_ru
      ? decodeHTML(this.middleName_ru)
      : this.middleName_ru;
    this.name_en = this.name_en ? decodeHTML(this.name_en) : this.name_en;
    this.lastName_en = this.lastName_en
      ? decodeHTML(this.lastName_en)
      : this.lastName_en;
    this.middleName_en = this.middleName_en
      ? decodeHTML(this.middleName_en)
      : this.middleName_en;
    this.description_uz = this.description_uz
      ? decodeHTML(this.description_uz)
      : this.description_uz;
    this.description_ru = this.description_ru
      ? decodeHTML(this.description_ru)
      : this.description_ru;
    this.description_en = this.description_en
      ? decodeHTML(this.description_en)
      : this.description_en;
  }

  getFullName(locale?: string): string {
    return (
      this[`name_${locale}`] +
      ' ' +
      this[`lastName_${locale}`] +
      ' ' +
      this[`middleName_${locale}`]
    );
  }

  getName(locale?: string): string {
    return this[`name_${locale}`];
  }

  getLastName(locale?: string): string {
    return this[`lastName_${locale}`];
  }

  getMiddleName(locale?: string): string {
    return this[`middleName_${locale}`];
  }

  getDescription(locale?: string): string {
    return this[`description_${locale}`];
  }
}
