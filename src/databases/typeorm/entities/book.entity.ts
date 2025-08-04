import { Author } from "./author.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
    ManyToOne,
    JoinTable,
    ManyToMany,
    AfterLoad,
    OneToMany,
} from 'typeorm';
import { File } from "./file.entity";
import { Genre } from "./genre.entity";
import { Issuer } from "./issuer.entity";
import { ReviewBook } from "./review-book.entity";
import { BookAudiobookLink } from "./book-audiobook-link.entity";
import { decodeHTML } from 'entities';

export enum BookLangEnum {
    UZ = 'uz',
    RU = 'ru',
    EN = 'en',
}

export enum PublishedEnum {
    UNPUBLISHED = '0',
    PUBLISHED = '1',
}

@Entity('books')
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name_ru: string;

    @Column({ type: 'varchar', length: 100 })
    name_uz: string;

    @Column({ type: 'varchar', length: 100 })
    name_en: string;

    @Column({ type: 'varchar', length: 1500 })
    description_uz: string;

    @Column({ type: 'varchar', length: 1500 })
    description_ru: string;

    @Column({ type: 'varchar', length: 1500 })
    description_en: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_short_uz: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_short_ru: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_short_en: string;

    @Column({ type: 'enum', enum: BookLangEnum })
    lang: BookLangEnum;

    @Column({ type: 'year' })
    year: number;

    @Column({ type: 'char', length: 50, nullable: true })
    ISBN: string;

    @Column({ type: 'smallint', nullable: true, comment: 'Количество страниц' })
    pages: number;

    @Column({ type: 'enum', enum: PublishedEnum, default: PublishedEnum.UNPUBLISHED })
    published: PublishedEnum;

    @Column({ type: 'tinyint', nullable: true, comment: 'ТОП\\Рекомендуемыми книгами редакцией.' })
    top: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cover: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @ManyToMany(() => Author, { nullable: true })
    @JoinTable()
    authors: Author[];

    @ManyToMany(() => File, { nullable: true })
    @JoinTable()
    files: File[];

    @ManyToMany(() => Genre, { nullable: true })
    @JoinTable()
    genres: Genre[];

    @ManyToMany(() => Issuer, { nullable: true })
    @JoinTable()
    issuers: Issuer[];

    @OneToMany(() => ReviewBook, (review) => review.book)
    reviews: ReviewBook[];

    @OneToMany(() => BookAudiobookLink, (link) => link.book)
    audiobookLinks: BookAudiobookLink[];

    @AfterLoad()
    setAuthorsAndFiles() {
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
        this.description_short_uz = this.description_short_uz ? decodeHTML(this.description_short_uz) : this.description_short_uz;
        this.description_short_ru = this.description_short_ru ? decodeHTML(this.description_short_ru) : this.description_short_ru;
        this.description_short_en = this.description_short_en ? decodeHTML(this.description_short_en) : this.description_short_en;
    }

    getName(locale?: Omit<BookLangEnum, 'UZ'>): string {
        switch (locale) {
            case 'uz':
                return this.name_uz;
            case 'ru':
                return this.name_ru;
            case 'en':
                return this.name_en;
            default:
                return this.name_uz;
        }
    }

    getDescription(locale?: Omit<BookLangEnum, 'UZ'>): string {
        switch (locale) {
            case 'uz':
                return this.description_uz;
            case 'ru':
                return this.description_ru;
            case 'en':
                return this.description_en;
            default:
                return this.description_uz;
        }
    }

    getDescriptionShort(locale?: Omit<BookLangEnum, 'UZ'>): string {
        switch (locale) {
            case 'uz':
                return this.description_short_uz;
            case 'ru':
                return this.description_short_ru;
            case 'en':
                return this.description_short_en;
            default:
                return this.description_short_uz;
        }
    }

}
