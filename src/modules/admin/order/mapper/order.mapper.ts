import { Order, OrderState } from 'src/databases/typeorm/entities';
import { OrderResponseDto } from '../dto/response/order.res.dto';
import { CreateOrderDto } from '../dto/request/create-order.dto';
import { UpdateOrderDto } from '../dto/request/update-order.dto';

export class OrderMapper {
  static toDto(entity: Order): OrderResponseDto {
    return new OrderResponseDto(
      entity.id,
      entity.customerId,
      entity.customer,
      entity.autoModelId,
      entity.autoModel,
      entity.autoPositionId,
      entity.autoPosition,
      entity.autoColorId,
      entity.autoColor,
      entity.contractCode,
      entity.state,
      entity.queueNumber,
      entity.amountDue,
      entity.orderDate,
      entity.price,
      entity.expectedDeliveryDate,
      entity.statusChangedAt,
      entity.frozen,
      entity.paidPercentage,
      entity.client_table_id,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: Order[]): OrderResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateOrderDto): Order {
    const order = new Order();
    order.customerId = dto.customerId;
    order.autoModelId = dto.autoModelId;
    order.autoPositionId = dto.autoPositionId;
    order.autoColorId = dto.autoColorId;
    order.contractCode = dto.contractCode;
    order.state = dto.state || OrderState.NEW;
    order.queueNumber = dto.queueNumber;
    order.amountDue = dto.amountDue;
    order.orderDate = new Date(dto.orderDate);
    order.price = dto.price;
    order.expectedDeliveryDate = new Date(dto.expectedDeliveryDate);
    order.statusChangedAt = dto.statusChangedAt ? new Date(dto.statusChangedAt) : new Date();
    order.frozen = dto.frozen || false;
    order.paidPercentage = dto.paidPercentage || 0;
    order.client_table_id = dto.client_table_id || null;
    return order;
  }

  static toEntityFromUpdateDto(dto: UpdateOrderDto, existingOrder: Order): Order {
    if (dto.customerId !== undefined) existingOrder.customerId = dto.customerId;
    if (dto.autoModelId !== undefined) existingOrder.autoModelId = dto.autoModelId;
    if (dto.autoPositionId !== undefined) existingOrder.autoPositionId = dto.autoPositionId;
    if (dto.autoColorId !== undefined) existingOrder.autoColorId = dto.autoColorId;
    if (dto.contractCode !== undefined) existingOrder.contractCode = dto.contractCode;
    if (dto.state !== undefined) existingOrder.state = dto.state;
    if (dto.queueNumber !== undefined) existingOrder.queueNumber = dto.queueNumber;
    if (dto.amountDue !== undefined) existingOrder.amountDue = dto.amountDue;
    if (dto.orderDate !== undefined) existingOrder.orderDate = new Date(dto.orderDate);
    if (dto.price !== undefined) existingOrder.price = dto.price;
    if (dto.expectedDeliveryDate !== undefined) existingOrder.expectedDeliveryDate = new Date(dto.expectedDeliveryDate);
    if (dto.statusChangedAt !== undefined) existingOrder.statusChangedAt = new Date(dto.statusChangedAt);
    if (dto.frozen !== undefined) existingOrder.frozen = dto.frozen;
    if (dto.paidPercentage !== undefined) existingOrder.paidPercentage = dto.paidPercentage;
    if (dto.client_table_id !== undefined) existingOrder.client_table_id = dto.client_table_id;
    return existingOrder;
  }
}
