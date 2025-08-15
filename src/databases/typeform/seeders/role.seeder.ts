import { DataSource } from 'typeorm';
import { Role } from '../../typeorm/entities/role.entity';
import { Permission } from '../../typeorm/entities/permission.entity';

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  
  // Check if roles already exist
  const existingRoles = await roleRepository.count();
  if (existingRoles > 0) {
    console.log('Roles already seeded');
    return;
  }

  // Get all permissions for assignment
  const allPermissions = await permissionRepository.find();
  
  // Define role-permission mappings
  const rolePermissionMappings = {
    'super_admin': allPermissions, // Super admin gets all permissions
    'admin': allPermissions.filter(p => 
      !p.name.includes('delete_permissions') && 
      !p.name.includes('create_permissions') &&
      !p.name.includes('manage_system')
    ),
    'moderator': allPermissions.filter(p => 
      p.name.includes('read_') || 
      p.name.includes('update_users') ||
      p.name.includes('view_reports')
    ),
    'user': allPermissions.filter(p => 
      p.name === 'read_users' || 
      p.name === 'read_roles'
    )
  };

  const roles = [
    {
      name: 'super_admin',
      permissions: rolePermissionMappings.super_admin
    },
    {
      name: 'admin',
      permissions: rolePermissionMappings.admin
    },
    {
      name: 'moderator',
      permissions: rolePermissionMappings.moderator
    },
    {
      name: 'user',
      permissions: rolePermissionMappings.user
    }
  ];

  try {
    for (const roleData of roles) {
      const role = roleRepository.create({
        name: roleData.name,
        permissions: roleData.permissions
      });
      await roleRepository.save(role);
    }
    
    console.log(`Successfully seeded ${roles.length} roles with their permissions`);
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
}