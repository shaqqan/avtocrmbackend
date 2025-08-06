import { DataSource } from 'typeorm';
import { Permission, Role } from '../entities';
import { Role as RoleEnum } from 'src/common/enums';

export class RoleSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get all permissions
    const permissions = await this.dataSource.manager.find(Permission);

    const adminRole = await this.dataSource.manager.findOne(Role, {
      where: { name: RoleEnum.SUPER_ADMIN },
    });

    if (!adminRole) {
      const newRole = this.dataSource.manager.create(Role, {
        name: RoleEnum.SUPER_ADMIN,
        permissions: permissions,
      });
      await this.dataSource.manager.save(newRole);
    }

    console.log('✅ Roles seeded');
  }
}
