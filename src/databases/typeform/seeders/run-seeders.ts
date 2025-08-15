import { DataSource } from 'typeorm';
import { runAllSeeders } from './index';
import { User } from '../../typeorm/entities/user.entity';
import { Role } from '../../typeorm/entities/role.entity';
import { Permission } from '../../typeorm/entities/permission.entity';

/**
 * Standalone script to run all database seeders
 * Usage: npx ts-node src/databases/typeform/seeders/run-seeders.ts
 */
async function main() {
  // Create DataSource instance
  // Note: You may need to adjust these connection settings based on your environment
  const dataSource = new DataSource({
    type: 'postgres', // or 'mysql', 'sqlite', etc.
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'typeform_db',
    entities: [User, Role, Permission],
    synchronize: false, // Set to true only in development if you want auto-schema sync
    logging: true,
  });

  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Database connection established');

    // Run all seeders
    await runAllSeeders(dataSource);

  } catch (error) {
    console.error('Failed to run seeders:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run the main function
main();