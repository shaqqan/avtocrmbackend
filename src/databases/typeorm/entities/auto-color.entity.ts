import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AutoModels } from "./auto-models.entity";

@Entity('auto_colors')
export class AutoColor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true }) // Temporarily nullable for migration
    autoModelId: number;

    @ManyToOne(() => AutoModels, (autoModel) => autoModel.autoColors)
    autoModel: AutoModels;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}