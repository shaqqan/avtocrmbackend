import * as NestConfig from '@nestjs/config';

export const RedisConfig = NestConfig.registerAs('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
}));
