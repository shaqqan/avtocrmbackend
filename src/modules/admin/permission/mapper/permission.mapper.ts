import { Permission } from 'src/databases/typeorm/entities';
import { PermissionResponseDto } from '../dto/response/permission.res.dto';
import { CreatePermissionDto } from '../dto/request/create-permission.dto';
import { UpdatePermissionDto } from '../dto/request/update-permission.dto';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

export class PermissionMapper {
  static toDto(entity: Permission): PermissionResponseDto {
    return new PermissionResponseDto(
      entity.id,
      entity.name,
      entity.action,
      entity.createdAt,
      entity.updatedAt,
    );
  }
  static toDtoList(entities: Permission[]): PermissionResponseDto[] {
    return entities.map((entity) => {
      let locale = currentLocale();
      if (!entity.name[locale]) {
        locale = Object.keys(entity.name)[0];
      }
      return new PermissionResponseDto(
        entity.id,
        entity.name[locale],
        entity.action,
        entity.createdAt,
        entity.updatedAt,
      );
    });
  }

  static toEntityFromCreateDto(dto: CreatePermissionDto): Permission {
    const permission = new Permission();
    Object.assign(permission, dto);
    return permission;
  }

  static toEntityFromUpdateDto(
    dto: UpdatePermissionDto,
    existingPermission: Permission,
  ): Permission {
    return Object.assign(existingPermission, dto);
  }
}
