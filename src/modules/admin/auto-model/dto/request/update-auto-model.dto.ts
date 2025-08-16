import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAutoModelDto } from './create-auto-model.dto';

export class UpdateAutoModelDto extends PartialType(CreateAutoModelDto) {
  @ApiProperty({
    description: 'Auto model ID',
    example: 1,
  })
  id: number;
}
