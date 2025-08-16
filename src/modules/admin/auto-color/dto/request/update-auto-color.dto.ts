import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAutoColorDto } from './create-auto-color.dto';

export class UpdateAutoColorDto extends PartialType(CreateAutoColorDto) {
  @ApiProperty({
    description: 'Auto color ID',
    example: 1,
  })
  id: number;
}
