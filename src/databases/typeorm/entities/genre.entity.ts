import { AfterLoad, BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { decodeHTML } from 'entities';

@Entity({ name: 'genres' })
export class Genre extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    parentId: number | null;

    @ManyToOne(() => Genre, { nullable: true, createForeignKeyConstraints: false })
    parent: Genre;

    @OneToMany(() => Genre, (genre) => genre.parent)
    children: Genre[];

    @Column({ nullable: true })
    cover: string;

    @Column({ nullable: true })
    name_uz: string;

    @Column({ nullable: true })
    name_ru: string;

    @Column({ nullable: true })
    name_en: string;

    @Column({ nullable: true, type: 'text' })
    description_uz: string;

    @Column({ nullable: true, type: 'text' })
    description_ru: string;

    @Column({ nullable: true, type: 'text' })
    description_en: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @AfterLoad()
    setCover() {
        this.cover = this.cover ? global.asset(this.cover) : null;
    }

    @AfterLoad()
    decodeName() {
        this.name_uz = this.name_uz ? decodeHTML(this.name_uz) : this.name_uz;
        this.name_ru = this.name_ru ? decodeHTML(this.name_ru) : this.name_ru;
        this.name_en = this.name_en ? decodeHTML(this.name_en) : this.name_en;
        this.description_uz = this.description_uz ? decodeHTML(this.description_uz) : this.description_uz;
        this.description_ru = this.description_ru ? decodeHTML(this.description_ru) : this.description_ru;
        this.description_en = this.description_en ? decodeHTML(this.description_en) : this.description_en;
    }
}
