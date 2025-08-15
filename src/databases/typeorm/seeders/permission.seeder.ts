import { DataSource } from 'typeorm';
import { Permission } from '../entities/permission.entity';

export async function seedPermissions(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);
  
  // Check if permissions already exist
  const existingPermissions = await permissionRepository.count();
  if (existingPermissions > 0) {
    console.log('Permissions already seeded');
    return;
  }

  const permissions = [
    {
      name: 'create_users',
      description: 'Permission to create new users'
    },
    {
      name: 'read_users',
      description: 'Permission to view user information'
    },
    {
      name: 'update_users',
      description: 'Permission to update user information'
    },
    {
      name: 'delete_users',
      description: 'Permission to delete users'
    },
    {
      name: 'create_roles',
      description: 'Permission to create new roles'
    },
    {
      name: 'read_roles',
      description: 'Permission to view role information'
    },
    {
      name: 'update_roles',
      description: 'Permission to update role information'
    },
    {
      name: 'delete_roles',
      description: 'Permission to delete roles'
    },
    {
      name: 'create_permissions',
      description: 'Permission to create new permissions'
    },
    {
      name: 'read_permissions',
      description: 'Permission to view permission information'
    },
    {
      name: 'update_permissions',
      description: 'Permission to update permission information'
    },
    {
      name: 'delete_permissions',
      description: 'Permission to delete permissions'
    },
    {
      name: 'manage_system',
      description: 'Permission to manage system settings'
    },
    {
      name: 'view_reports',
      description: 'Permission to view system reports'
    },
    {
      name: 'export_data',
      description: 'Permission to export system data'
    }
  ];

  try {
    await permissionRepository.save(permissions);
    console.log(`Successfully seeded ${permissions.length} permissions`);
  } catch (error) {
    console.error('Error seeding permissions:', error);
    throw error;
  }
}