import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService, ConfigType } from '@nestjs/config';
import { RedisConfig } from 'src/common/configs';

@Injectable()
export class RedisService
  implements OnModuleDestroy, OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  private readonly prefix = 'kitob_uz_';
  private readonly defaultTTL = 3600; // 1 hour default TTL

  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    const redisConfig =
      this.configService.getOrThrow<ConfigType<typeof RedisConfig>>('redis');
    this.redisClient = new Redis({
      host: redisConfig.host || 'localhost',
      port: redisConfig.port || 6379,
      password: redisConfig.password,
      // Performance optimizations
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      // Connection pooling
      family: 4, // IPv4
      // Performance settings
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      // Pipeline optimization
      enableOfflineQueue: false,
    });

    // Handle connection events
    this.redisClient.on('connect', () => {
      console.log('✅ Redis connected');
    });

    this.redisClient.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    this.redisClient.on('ready', () => {
      console.log('🚀 Redis ready for operations');
    });
  }

  onApplicationShutdown(signal?: string) {
    console.log(`Redis service shutting down with signal: ${signal}`);
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }

  /**
   * Builds a cache key with prefix
   */
  private buildKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Retrieves the remaining time to live (TTL) of a Redis key.
   * @param key - The key to retrieve the TTL for.
   * @returns A promise that resolves to the TTL of the key in seconds.
   */
  async getExpiry(key: string): Promise<number> {
    return this.redisClient.ttl(this.buildKey(key));
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   * Implements automatic JSON parsing and compression for large values.
   *
   * @param key - The key to retrieve the value for.
   * @returns A Promise that resolves to the value associated with the key.
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(this.buildKey(key));
      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  /**
   * Sets a value in Redis with optimized serialization and optional compression.
   * @param key - The key to set the value for.
   * @param value - The value to be set.
   * @param ttl - Optional TTL in seconds (defaults to 1 hour)
   * @returns A Promise that resolves when the value is set.
   */
  async set(
    key: string,
    value: any,
    ttl: number = this.defaultTTL,
  ): Promise<void> {
    try {
      const serializedValue =
        typeof value === 'object' ? JSON.stringify(value) : String(value);

      if (ttl > 0) {
        await this.redisClient.set(
          this.buildKey(key),
          serializedValue,
          'EX',
          ttl,
        );
      } else {
        await this.redisClient.set(this.buildKey(key), serializedValue);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  /**
   * Deletes a key from Redis.
   * @param key - The key to delete.
   * @returns A Promise that resolves when the key is deleted.
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(this.buildKey(key));
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  /**
   * Deletes multiple keys from Redis efficiently using pipelining.
   * @param keys - Array of keys to delete.
   * @returns A Promise that resolves when all keys are deleted.
   */
  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    try {
      const pipeline = this.redisClient.pipeline();
      keys.forEach((key) => pipeline.del(this.buildKey(key)));
      await pipeline.exec();
    } catch (error) {
      console.error('Redis deleteMany error:', error);
    }
  }

  /**
   * Sets multiple values in Redis efficiently using pipelining.
   * @param entries - Array of key-value pairs to set.
   * @param ttl - Optional TTL in seconds (defaults to 1 hour)
   * @returns A Promise that resolves when all values are set.
   */
  async setMany(
    entries: Array<{ key: string; value: any }>,
    ttl: number = this.defaultTTL,
  ): Promise<void> {
    if (entries.length === 0) return;

    try {
      const pipeline = this.redisClient.pipeline();

      entries.forEach(({ key, value }) => {
        const serializedValue =
          typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (ttl > 0) {
          pipeline.set(this.buildKey(key), serializedValue, 'EX', ttl);
        } else {
          pipeline.set(this.buildKey(key), serializedValue);
        }
      });

      await pipeline.exec();
    } catch (error) {
      console.error('Redis setMany error:', error);
    }
  }

  /**
   * Gets multiple values from Redis efficiently using pipelining.
   * @param keys - Array of keys to retrieve.
   * @returns A Promise that resolves to an array of values.
   */
  async getMany<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (keys.length === 0) return [];

    try {
      const pipeline = this.redisClient.pipeline();
      keys.forEach((key) => pipeline.get(this.buildKey(key)));

      const results = await pipeline.exec();
      return (
        results?.map(([err, value]) => {
          if (err || !value) return null;
          try {
            return JSON.parse(value as string) as T;
          } catch {
            return value as unknown as T;
          }
        }) ?? []
      );
    } catch (error) {
      console.error('Redis getMany error:', error);
      return new Array(keys.length).fill(null);
    }
  }

  /**
   * Implements a cache-aside pattern with automatic refresh.
   * @param key - The cache key
   * @param fetchFn - Function to fetch data if cache misses
   * @param ttl - Optional TTL in seconds
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.defaultTTL,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const fresh = await fetchFn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  /**
   * Increments a counter with optional expiry.
   * @param key - The counter key
   * @param ttl - Optional TTL in seconds
   */
  async increment(key: string, ttl: number = this.defaultTTL): Promise<number> {
    try {
      const value = await this.redisClient.incr(this.buildKey(key));
      if (ttl > 0) {
        await this.redisClient.expire(this.buildKey(key), ttl);
      }
      return value;
    } catch (error) {
      console.error('Redis increment error:', error);
      return 0;
    }
  }

  /**
   * Delete keys matching a pattern for cache invalidation
   * @param pattern - The pattern to match (e.g., "user:*")
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const fullPattern = this.buildKey(pattern);
      const keys = await this.redisClient.keys(fullPattern);

      if (keys.length > 0) {
        // Use pipeline for better performance when deleting multiple keys
        const pipeline = this.redisClient.pipeline();
        keys.forEach((key) => pipeline.del(key));
        await pipeline.exec();
      }
    } catch (error) {
      console.error('Redis deletePattern error:', error);
    }
  }

  /**
   * Check if Redis is connected and responsive
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.redisClient.ping();
      return true;
    } catch {
      return false;
    }
  }
}
