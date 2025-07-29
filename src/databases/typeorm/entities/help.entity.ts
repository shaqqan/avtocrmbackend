import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
