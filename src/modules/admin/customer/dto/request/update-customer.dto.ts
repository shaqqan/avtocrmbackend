import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  id: number;
}
