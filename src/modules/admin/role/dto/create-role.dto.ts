import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { AlreadyExists } from "src/common/decorators/validators";
import { Role } from "src/databases/typeorm/entities";

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
}
