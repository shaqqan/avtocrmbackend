import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AutoColor } from "./auto-color.entity";
import { AutoPosition } from "./auto-position.entity";
import { AutoModels } from "./auto-models.entity";

@Entity('price_lists')
export class PriceList extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    autoModelId: number;

    @ManyToOne(() => AutoModels)
    autoModel: AutoModels;

    @Column()
    autoColorId: number;

    @ManyToOne(() => AutoColor)
    autoColor: AutoColor;

    @Column()
    autoPositionId: number;

    @ManyToOne(() => AutoPosition)
    autoPosition: AutoPosition;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    basePrice: number | null;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    wholesalePrice: number | null;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    retailPrice: number | null;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    vat: number | null;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    margin: number | null;

    @Column({ type: 'date', nullable: true })
    validFrom: Date | null;

    @Column({ type: 'date', nullable: true })
    validTo: Date | null;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}