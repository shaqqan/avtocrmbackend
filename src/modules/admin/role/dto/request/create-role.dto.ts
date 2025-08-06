import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AlreadyExists, Exists } from 'src/common/decorators/validators';
import { Permission, Role } from 'src/databases/typeorm/entities';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @AlreadyExists(Role, 'name')
  name: string;

  @ApiProperty({
    description: 'The permissions to assign to the role',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Exists(Permission, 'id')
  permissionIds: number[];
}
