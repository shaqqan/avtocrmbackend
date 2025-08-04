import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, AfterLoad } from "typeorm";
import { decodeHTML } from 'entities';

export enum NewsStatus {
    ACTIVE = 'Активно',
    INACTIVE = 'Неактивно',
}

@Entity('news')
export class News extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title_uz: string;

    @Column()
    title_ru: string;

    @Column()
    title_en: string;

    @Column({ type: 'text' })
    description_uz: string;

    @Column({ type: 'text' })
    description_ru: string;

    @Column({ type: 'text' })
    description_en: string;

    @Column()
    cover: string;

    @Column({
        type: 'enum',
        enum: NewsStatus,
        default: NewsStatus.ACTIVE,
        nullable: true,
    })
    status: NewsStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @AfterLoad()
    afterLoad() {
        this.cover = this.cover ? global.asset(this.cover) : null;
    }

    @AfterLoad()
    decodeName() {
        this.title_uz = this.title_uz ? decodeHTML(this.title_uz) : this.title_uz;
        this.title_ru = this.title_ru ? decodeHTML(this.title_ru) : this.title_ru;
        this.title_en = this.title_en ? decodeHTML(this.title_en) : this.title_en;
        this.description_uz = this.description_uz ? decodeHTML(this.description_uz) : this.description_uz;
        this.description_ru = this.description_ru ? decodeHTML(this.description_ru) : this.description_ru;
        this.description_en = this.description_en ? decodeHTML(this.description_en) : this.description_en;
    }
}
