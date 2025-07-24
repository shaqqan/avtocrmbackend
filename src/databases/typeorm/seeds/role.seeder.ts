import { DataSource } from "typeorm";
import { Permission, Role } from "../entities";

export class RoleSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get all permissions
    const permissions = await this.dataSource.manager.find(Permission);

    // Find or create admin role
    let adminRole = await this.dataSource.manager.findOne(Role, {
      where: { name: 'admin' },
      relations: ['permissions']
    });

    if (!adminRole) {
      adminRole = await this.dataSource.manager.save(Role, {
        name: 'admin',
        permissions: permissions,
      });
    } else {
      // Update permissions for existing admin role
      adminRole.permissions = permissions;
      await this.dataSource.manager.save(adminRole);
    }

    console.log('✅ Roles seeded');
  }
}   