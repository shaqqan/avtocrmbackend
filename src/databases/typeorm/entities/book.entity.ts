import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
} from 'typeorm';

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

    @Column({ type: 'varchar', length: 70, nullable: true })
    cover: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

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
