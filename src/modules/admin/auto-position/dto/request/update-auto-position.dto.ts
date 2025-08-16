import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAutoPositionDto } from './create-auto-position.dto';

export class UpdateAutoPositionDto extends PartialType(CreateAutoPositionDto) {
  @ApiProperty({
    description: 'Auto position ID',
    example: 1,
  })
  id: number;
}
