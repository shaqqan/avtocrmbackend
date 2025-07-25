import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { Exists } from "src/common/decorators/validators";
import { Permission } from "src/databases/typeorm/entities";

export class AssignPermissionDto {
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