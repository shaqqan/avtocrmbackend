import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stock.entity";

@Entity('warehouses')
export class Warehouse extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({ type: 'point', nullable: true })
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @OneToMany(() => Stock, (stock) => stock.warehouse)
    stocks: Stock[];
}