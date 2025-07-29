import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

}
