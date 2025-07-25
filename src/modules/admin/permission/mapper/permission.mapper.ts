import { Permission } from "src/databases/typeorm/entities";
import { PermissionResponseDto } from "../dto/response/permission.res.dto";
import { CreatePermissionDto } from "../dto/request/create-permission.dto";
import { UpdatePermissionDto } from "../dto/request/update-permission.dto";
import { I18nContext } from "nestjs-i18n";

export class PermissionMapper {
    static toDto(entity: Permission): PermissionResponseDto {
        return new PermissionResponseDto(
            entity.id,
            entity.name,
            entity.action,
            entity.createdAt,
            entity.updatedAt
        );
    }
    static toDtoList(entities: Permission[]): PermissionResponseDto[] {
        return entities.map(entity => {
            let currentLocale = I18nContext.current()?.lang || 'uz';
            if (!entity.name[currentLocale]) {
                currentLocale = Object.keys(entity.name)[0];
            }
            return new PermissionResponseDto(
                entity.id,
                entity.name[currentLocale],
                entity.action,
                entity.createdAt,
                entity.updatedAt
            );
        });
    }

    static toEntityFromCreateDto(dto: CreatePermissionDto): Permission {
        const permission = new Permission();
        Object.assign(permission, dto);
        return permission;
    }

    static toEntityFromUpdateDto(dto: UpdatePermissionDto, existingPermission: Permission): Permission {
        return Object.assign(existingPermission, dto);
    }
}