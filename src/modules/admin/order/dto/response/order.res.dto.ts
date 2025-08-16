import { OrderState } from 'src/databases/typeorm/entities';

export class OrderResponseDto {
  constructor(
    public id: number,
    public customerId: number,
    public customer: any,
    public autoModelId: number,
    public autoModel: any,
    public autoPositionId: number,
    public autoPosition: any,
    public autoColorId: number,
    public autoColor: any,
    public contractCode: string,
    public state: OrderState,
    public queueNumber: number,
    public amountDue: number,
    public orderDate: Date,
    public price: number,
    public expectedDeliveryDate: Date,
    public statusChangedAt: Date,
    public frozen: boolean,
    public paidPercentage: number,
    public client_table_id: number | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.customer = customer;
    this.autoModelId = autoModelId;
    this.autoModel = autoModel;
    this.autoPositionId = autoPositionId;
    this.autoPosition = autoPosition;
    this.autoColorId = autoColorId;
    this.autoColor = autoColor;
    this.contractCode = contractCode;
    this.state = state;
    this.queueNumber = queueNumber;
    this.amountDue = amountDue;
    this.orderDate = orderDate;
    this.price = price;
    this.expectedDeliveryDate = expectedDeliveryDate;
    this.statusChangedAt = statusChangedAt;
    this.frozen = frozen;
    this.paidPercentage = paidPercentage;
    this.client_table_id = client_table_id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
