import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    description: 'Order ID',
    example: 1,
  })
  id: number;
}
