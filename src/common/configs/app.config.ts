import * as NestConfig from '@nestjs/config';

export const AppConfig = NestConfig.registerAs('node', () => ({
    host: process.env.NODE_HOST || '127.0.0.1',
    port: process.env.NODE_PORT || 3000,
    name: process.env.NODE_NAME || '24GO.uz',
    url: process.env.NODE_URL || 'http://127.0.0.1:3000',
}));