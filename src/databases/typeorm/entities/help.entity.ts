import { AfterLoad, BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { decodeHTML } from 'entities';

@Entity({ name: 'helps' })
export class Help extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name_uz: string;

    @Column()
    name_ru: string;

    @Column()
    name_en: string;

    @Column({ type: 'text' })
    description_uz: string;

    @Column({ type: 'text' })
    description_ru: string;

    @Column({ type: 'text' })
    description_en: string;

    @CreateDateColumn()
    createdAt: Date;

    @AfterLoad()
    decodeHTMLName() {
        this.name_uz = this.name_uz ? decodeHTML(this.name_uz) : this.name_uz;
        this.name_ru = this.name_ru ? decodeHTML(this.name_ru) : this.name_ru;
        this.name_en = this.name_en ? decodeHTML(this.name_en) : this.name_en;
        this.description_uz = this.description_uz ? decodeHTML(this.description_uz) : this.description_uz;
        this.description_ru = this.description_ru ? decodeHTML(this.description_ru) : this.description_ru;
        this.description_en = this.description_en ? decodeHTML(this.description_en) : this.description_en;
    }
}
