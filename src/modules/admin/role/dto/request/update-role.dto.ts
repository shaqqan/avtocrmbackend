import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Exists } from 'src/common/decorators/validators';
import { Permission } from 'src/databases/typeorm/entities';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  name: string;

  @ApiProperty({
    description: 'The permissions to assign to the role',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Exists(Permission, 'id')
  permissionIds: number[];
}
