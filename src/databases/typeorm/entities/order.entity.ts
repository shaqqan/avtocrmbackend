import { 
  BaseEntity, 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  JoinColumn 
} from "typeorm";
import { AutoModels, AutoColor, Customer, AutoPosition } from "./index";

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
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    autoModelId: number;

    @ManyToOne(() => AutoModels)
    @JoinColumn({ name: 'autoModelId' })
    autoModel: AutoModels;

    @Column()
    autoPositionId: number;

    @ManyToOne(() => AutoPosition)
    @JoinColumn({ name: 'autoPositionId' })
    autoPosition: AutoPosition;

    @Column()
    autoColorId: number;

    @ManyToOne(() => AutoColor)
    @JoinColumn({ name: 'autoColorId' })
    autoColor: AutoColor;

    @Column({ unique: true })
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

    @Column({ type: 'integer', nullable: true })
    client_table_id: number | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
