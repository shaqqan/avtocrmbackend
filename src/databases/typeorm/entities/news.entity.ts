import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, AfterLoad } from "typeorm";

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
}
