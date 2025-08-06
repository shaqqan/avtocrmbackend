import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Role IDs to assign to user',
    example: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];
}
