import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiProperty({
    description: 'Warehouse ID',
    example: 1,
  })
  id: number;
}
