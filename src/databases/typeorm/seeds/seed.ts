import { config } from 'dotenv';

import dataSource from '../data-source';
import { PermissionSeeder } from './permission.seeder';
import { UserSeeder } from './user.seeder';
import { RoleSeeder } from './role.seeder';
import { LanguageSeeder } from './language.seeder';

config();
async function seed() {
  try {
    await dataSource.initialize();

    // const permissionSeeder = new PermissionSeeder(dataSource);
    // await permissionSeeder.seed();

    // const roleSeeder = new RoleSeeder(dataSource);
    // await roleSeeder.seed();

    // const userSeeder = new UserSeeder(dataSource);
    // await userSeeder.seed();

    const languageSeeder = new LanguageSeeder(dataSource);
    await languageSeeder.seed();

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed(); 