import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  
  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Users already seeded');
    return;
  }

  // Get roles for assignment
  const superAdminRole = await roleRepository.findOne({ where: { name: 'super_admin' } });
  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  const moderatorRole = await roleRepository.findOne({ where: { name: 'moderator' } });
  const userRole = await roleRepository.findOne({ where: { name: 'user' } });

  if (!superAdminRole || !adminRole || !moderatorRole || !userRole) {
    throw new Error('Required roles not found. Please seed roles first.');
  }

  const users = [
    {
      name: 'Super Administrator',
      email: 'superadmin@example.com',
      roles: [superAdminRole]
    },
    {
      name: 'System Administrator',
      email: 'admin@example.com',
      roles: [adminRole]
    },
    {
      name: 'Content Moderator',
      email: 'moderator@example.com',
      roles: [moderatorRole]
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      roles: [userRole]
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      roles: [userRole]
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      roles: [userRole, moderatorRole] // User with multiple roles
    }
  ];

  try {
    for (const userData of users) {
      const user = userRepository.create({
        name: userData.name,
        email: userData.email,
        roles: userData.roles
      });
      await userRepository.save(user);
    }
    
    console.log(`Successfully seeded ${users.length} users with their roles`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}