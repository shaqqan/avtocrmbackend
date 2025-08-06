import { Role } from 'src/databases/typeorm/entities';
import { RoleResponseDto } from '../dto/response/role.res.dto';
import { CreateRoleDto } from '../dto/request/create-role.dto';
import { UpdateRoleDto } from '../dto/request/update-role.dto';
import { PermissionMapper } from 'src/modules/admin/permission/mapper/permission.mapper';

export class RoleMapper {
  static toDto(entity: Role): RoleResponseDto {
    return new RoleResponseDto(
      entity.id,
      entity.name,
      PermissionMapper.toDtoList(entity.permissions),
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: Role[]): RoleResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateRoleDto): Role {
    const role = new Role();
    Object.assign(role, dto);
    return role;
  }

  static toEntityFromUpdateDto(dto: UpdateRoleDto, existingRole: Role): Role {
    return Object.assign(existingRole, dto);
  }
}
