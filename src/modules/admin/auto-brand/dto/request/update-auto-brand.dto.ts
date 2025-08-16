import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAutoBrandDto } from './create-auto-brand.dto';

export class UpdateAutoBrandDto extends PartialType(CreateAutoBrandDto) {
  @ApiProperty({
    description: 'Auto brand ID',
    example: 1,
  })
  id: number;
}
