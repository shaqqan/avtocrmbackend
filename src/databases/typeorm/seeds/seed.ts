import { config } from 'dotenv';
import dataSource from '../data-source';
import { LanguageSeeder } from './language.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';

config();
async function seed() {
  try {
    await dataSource.initialize();

    // const languageSeeder = new LanguageSeeder(dataSource);
    // await languageSeeder.seed();

    const permissionSeeder = new PermissionSeeder(dataSource);
    await permissionSeeder.seed();

    const roleSeeder = new RoleSeeder(dataSource);
    await roleSeeder.seed();
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
    process.exit(0);
  }
}

seed();
