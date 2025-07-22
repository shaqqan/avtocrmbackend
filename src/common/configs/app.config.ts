import * as NestConfig from '@nestjs/config';

export const AppConfig = NestConfig.registerAs('node', () => ({
    env: process.env.NODE_ENV ?? 'development',
    host: process.env.NODE_HOST ?? 'localhost',
    port: +(process.env.NODE_PORT ?? 3000),
    name: process.env.NODE_NAME ?? 'app',
    url: process.env.NODE_URL ?? 'http://localhost:3000',
}));
