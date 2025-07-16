import { FactoryProvider } from '@nestjs/common'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

config()

export const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    // Performance optimizations
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    // Connection pool settings
    connectionName: 'kitob_uz_api',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    connectTimeout: 10000,
    commandTimeout: 5000,
    keepAlive: 10000,
    reconnectOnError(err: Error) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    },
}

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new Redis({
            ...redisConfig,
            // Additional cluster/sentinel support if needed
            sentinels: process.env.REDIS_SENTINELS ? JSON.parse(process.env.REDIS_SENTINELS) : undefined,
            sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD,
            name: process.env.REDIS_SENTINEL_NAME,
        })

        redisInstance.on('error', (e) => {
            console.error(`Redis connection failed: ${e}`)
            // Log but don't throw to prevent app crash
            if (process.env.NODE_ENV === 'development') {
                console.error('Redis connection error details:', e.stack);
            }
        })

        redisInstance.on('ready', () => {
            console.log('Redis client connected and ready');
        })

        redisInstance.on('reconnecting', () => {
            console.log('Redis client reconnecting...');
        })

        // Monitor memory usage
        if (process.env.NODE_ENV === 'production') {
            setInterval(async () => {
                try {
                    const info = await redisInstance.info('memory');
                    const usedMemory = parseInt(info.match(/used_memory:(\d+)/)?.[1] || '0', 10);
                    if (usedMemory > 1024 * 1024 * 1024) { // 1GB
                        console.warn('Redis memory usage exceeds 1GB:', usedMemory);
                    }
                } catch (error) {
                    console.error('Failed to check Redis memory usage:', error);
                }
            }, 300000); // Check every 5 minutes
        }

        return redisInstance
    },
    inject: [],
}