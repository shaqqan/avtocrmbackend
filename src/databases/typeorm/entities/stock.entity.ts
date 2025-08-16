import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";
import { AutoModels } from "./auto-models.entity";
import { AutoColor } from "./auto-color.entity";
import { AutoPosition } from "./auto-position.entity";

export enum StockStatus {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
    SOLD = 'sold',
}

@Entity('stocks')
export class Stock extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    warehouseId: number;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.stocks)
    warehouse: Warehouse;

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

    @Column()
    bodyNumber: string;

    @Column({ type: 'date', nullable: true })
    arrivalDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    factoryPrice: number;

    @Column({
        type: 'enum',
        enum: StockStatus,
        default: StockStatus.AVAILABLE,
    })
    status: StockStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}