import { BaseEntity, BeforeInsert, AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";

@Entity('authors')
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name_uz: string;

    @Column({ type: 'varchar', length: 50 })
    lastName_uz: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    middleName_uz: string;

    @Column({ type: 'varchar', length: 50 })
    name_ru: string;

    @Column({ type: 'varchar', length: 50 })
    lastName_ru: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    middleName_ru: string;

    @Column({ type: 'varchar', length: 50 })
    name_en: string;

    @Column({ type: 'varchar', length: 50 })
    lastName_en: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    middleName_en: string;

    @Column({ type: 'varchar', length: 4000 })
    description_uz: string;

    @Column({ type: 'varchar', length: 4000 })
    description_ru: string;

    @Column({ type: 'varchar', length: 4000 })
    description_en: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cover: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ default: null })
    deletedAt: Date;

    @AfterLoad()
    setUrlCover() {
        this.cover = global.asset(this.cover);
    }

    getName(locale?: string): string {
        return this[`name_${locale}`];
    }

    getLastName(locale?: string): string {
        return this[`lastName_${locale}`];
    }

    getMiddleName(locale?: string): string {
        return this[`middleName_${locale}`];
    }

    getDescription(locale?: string): string {
        return this[`description_${locale}`];
    }

}
