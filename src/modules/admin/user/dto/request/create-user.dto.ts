import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+998901234567',
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'User password', example: 'SecurePassword123!' })
  @IsString()
  @MinLength(6)
  password: string;

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
