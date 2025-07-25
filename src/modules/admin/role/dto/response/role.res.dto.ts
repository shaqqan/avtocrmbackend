import { PermissionResponseDto } from "src/modules/admin/permission/dto/response/permission.res.dto";

export class RoleResponseDto {
    constructor(
        public id: number,
        public name: string,
        public permissions: PermissionResponseDto[],
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}