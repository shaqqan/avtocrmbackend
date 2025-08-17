import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '..', '..', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  subscribers: [path.join(__dirname, 'subscribers', '*.subscriber{.ts,.js}')],
  synchronize: true, //process.env.NODE_ENV === 'development',
  // Connection pooling for high performance
  extra: {
    connectionLimit: 100,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    // MySQL specific optimizations
    charset: 'utf8mb4_unicode_ci',
    // Connection pool optimizations
    idleTimeout: 300000, // 5 minutes
    // Performance settings
    supportBigNumbers: true,
    bigNumberStrings: false,
    // Enable prepared statements for better performance
    trace: false,
    debug: false,
  },


  // Logging optimizations (disable in production)
  logging: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : false,

  // Enable query result caching
  maxQueryExecutionTime: 1000, // Log slow queries > 1s
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  });
export default dataSource;
