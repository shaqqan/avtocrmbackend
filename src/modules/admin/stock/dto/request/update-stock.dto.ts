import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @ApiProperty({
    description: 'Stock ID',
    example: 1,
  })
  id: number;
}
