import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    AfterLoad,
    UpdateDateColumn,
    CreateDateColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import { Author } from './author.entity';
import { Genre } from './genre.entity';
import { Issuer } from './issuer.entity';
import { File } from './file.entity';
import { ReviewsAudiobook } from './reviews-audiobook.entity';
import { BookAudiobookLink } from './book-audiobook-link.entity';
import { decodeHTML  } from 'entities';

export enum AudioBookLangEnum {
    UZ = 'uz',
    RU = 'ru',
    EN = 'en',
}

export enum AudioBookPublishedEnum {
    UNPUBLISHED = '0',
    PUBLISHED = '1',
}

@Entity('audiobooks')
export class AudioBook extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name_ru: string;

    @Column({ type: 'varchar', length: 100 })
    name_uz: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    name_en: string;

    @Column({ type: 'varchar', length: 1500 })
    description_uz: string;

    @Column({ type: 'varchar', length: 1500 })
    description_ru: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_en: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_short_uz: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_short_ru: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description_short_en: string;

    @Column({ type: 'enum', enum: AudioBookLangEnum })
    lang: AudioBookLangEnum;

    @Column({ type: 'year' })
    year: number;

    @Column({ type: 'char', length: 50, nullable: true })
    ISBN: string;

    @Column({ type: 'int', nullable: true })
    duration: number;

    @Column({
        type: 'enum',
        enum: AudioBookPublishedEnum,
        default: AudioBookPublishedEnum.UNPUBLISHED,
        nullable: true,
        comment: '1= "Опубликован", 2="В черновиках", 3="Не опубликован".'
    })
    published: AudioBookPublishedEnum;

    @Column({
        type: 'tinyint',
        nullable: true,
        comment: 'ТОП\\Рекомендуемыми книгами редакцией.'
    })
    top: number;

    @Column({ type: 'varchar', length: 70, nullable: true })
    cover: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

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

    @OneToMany(() => ReviewsAudiobook, (review) => review.audiobook)
    reviews: ReviewsAudiobook[];

    @OneToMany(() => BookAudiobookLink, (link) => link.audiobook)
    bookLinks: BookAudiobookLink[];

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
        this.description_short_uz = this.description_short_uz ? decodeHTML(this.description_short_uz) : this.description_short_uz;
        this.description_short_ru = this.description_short_ru ? decodeHTML(this.description_short_ru) : this.description_short_ru;
        this.description_short_en = this.description_short_en ? decodeHTML(this.description_short_en) : this.description_short_en;
    }

    getName(locale?: Omit<AudioBookLangEnum, 'UZ'>): string {
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

    getDescription(locale?: Omit<AudioBookLangEnum, 'UZ'>): string {
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

    getDescriptionShort(locale?: Omit<AudioBookLangEnum, 'UZ'>): string {
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
