import { FactoryProvider } from '@nestjs/common'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

config()

export const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
}

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new Redis(redisConfig)

        redisInstance.on('error', (e) => {
            console.error(`Redis connection failed: ${e}`)
            // throw new Error(`Redis connection failed: ${e}`);
        })

        return redisInstance
    },
    inject: [],
}