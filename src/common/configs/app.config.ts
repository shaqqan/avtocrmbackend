import * as NestConfig from '@nestjs/config';

export const AppConfig = NestConfig.registerAs('node', () => ({
    host: process.env.NODE_HOST || '0.0.0.0',
    port: process.env.NODE_PORT || 3000,
    name: process.env.NODE_NAME || 'Kitob.uz',
    url: process.env.NODE_URL || 'http://0.0.0.0:3000',
}));