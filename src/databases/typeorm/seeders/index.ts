import { DataSource } from 'typeorm';
import { seedPermissions } from './permission.seeder';
import { seedRoles } from './role.seeder';
import { seedUsers } from './user.seeder';

export { seedPermissions } from './permission.seeder';
export { seedRoles } from './role.seeder';
export { seedUsers } from './user.seeder';

export async function runAllSeeders(dataSource: DataSource): Promise<void> {
  console.log('Starting database seeding...');

  try {
    // Step 1: Seed permissions
    console.log('Seeding permissions...');
    await seedPermissions(dataSource);

    // Step 2: Seed roles (with their permissions)
    console.log('Seeding roles...');
    await seedRoles(dataSource);

    // Step 3: Seed users (with their roles)
    console.log('Seeding users...');
    await seedUsers(dataSource);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}