import { config } from 'dotenv';
import dataSource from '../data-source';
import { LanguageSeeder } from './language.seeder';

config();
async function seed() {
  try {
    await dataSource.initialize();

    const languageSeeder = new LanguageSeeder(dataSource);
    await languageSeeder.seed();

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed(); 