import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AutoModels, AutoColor, Customer, AutoPosition } from "../entities";

export enum OrderState {
    NEW = 'new',
    ON_THE_WAY = 'on_the_way',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerId: number;

    @ManyToOne(() => Customer)
    customer: Customer;

    @Column()
    autoModelId: number;

    @ManyToOne(() => AutoModels)
    autoModel: AutoModels;

    @Column()
    autoPositionId: number;

    @ManyToOne(() => AutoPosition)
    autoPosition: AutoPosition;

    @Column()
    autoColorId: number;

    @ManyToOne(() => AutoColor)
    autoColor: AutoColor;

    @Column()
    contractCode: string;

    @Column({ type: 'enum', enum: OrderState, default: OrderState.NEW })
    state: OrderState;

    @Column()
    queueNumber: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amountDue: number;

    @Column({ type: 'date' })
    orderDate: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    price: number;

    @Column({ type: 'date' })
    expectedDeliveryDate: Date;

    @Column({ type: 'timestamp' })
    statusChangedAt: Date;

    @Column({ type: 'boolean', default: false })
    frozen: boolean;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    paidPercentage: number;

    @Column({ nullable: true })
    client_table_id: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}