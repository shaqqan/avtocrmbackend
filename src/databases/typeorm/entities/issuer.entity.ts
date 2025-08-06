import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { decodeHTML } from 'entities';

@Entity({ name: 'issuers' })
export class Issuer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name_uz: string;

  @Column({ nullable: true })
  name_ru: string;

  @Column({ nullable: true })
  name_en: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  decodeHTMLName() {
    this.name_uz = this.name_uz ? decodeHTML(this.name_uz) : this.name_uz;
    this.name_ru = this.name_ru ? decodeHTML(this.name_ru) : this.name_ru;
    this.name_en = this.name_en ? decodeHTML(this.name_en) : this.name_en;
  }
}
