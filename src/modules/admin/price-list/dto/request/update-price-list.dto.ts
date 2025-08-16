import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreatePriceListDto } from './create-price-list.dto';

export class UpdatePriceListDto extends PartialType(CreatePriceListDto) {
  @ApiProperty({
    description: 'Price list ID',
    example: 1,
  })
  id: number;
}
