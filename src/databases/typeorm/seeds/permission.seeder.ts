import { DataSource } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { PermissionsEnum } from '../../../common/enums/permission.enum';

export class PermissionSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const permissionRepository = this.dataSource.getRepository(Permission);

    // Create permissions for each enum value
    const permissions = Object.values(PermissionsEnum).map((action: PermissionsEnum) => ({
      action,
      name: {
        en: action.toLowerCase().replace(/_/g, ' '),
        uz: action.toLowerCase().replace(/_/g, ' '),
        ru: action.toLowerCase().replace(/_/g, ' ')
      }
    }));

    // Insert permissions if they don't exist
    for (const permission of permissions) {
      const exists = await permissionRepository.findOne({
        where: { action: permission.action as PermissionsEnum }
      });

      if (!exists) {
        await permissionRepository.save(permission);
      }
    }

    console.log('✅ Permissions seeded');
  }
}   