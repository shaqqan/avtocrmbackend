import * as NestConfig from '@nestjs/config';

export const TypeormConfig = NestConfig.registerAs('typeorm', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));
