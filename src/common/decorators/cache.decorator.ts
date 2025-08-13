import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache_key_metadata';
export const CACHE_TTL_METADATA = 'cache_ttl_metadata';

export interface CacheOptions {
  key: string;
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

/**
 * Decorator to cache method results using Redis
 * Usage: @Cache({ key: 'user:profile', ttl: 3600 })
 */
export const Cache = (options: CacheOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Get Redis service from the class instance
      const redisService = this.redisService;
      if (!redisService) {
        return originalMethod.apply(this, args);
      }

      // Build cache key
      const cacheKey = options.prefix
        ? `${options.prefix}:${options.key}`
        : options.key;

      // Try to get from cache first
      const cached = await redisService.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, execute original method
      const result = await originalMethod.apply(this, args);

      // Cache the result
      await redisService.set(cacheKey, result, options.ttl || 3600);

      return result;
    };

    // Set metadata for potential use in interceptors
    SetMetadata(CACHE_KEY_METADATA, options.key)(
      target,
      propertyKey,
      descriptor,
    );
    SetMetadata(CACHE_TTL_METADATA, options.ttl || 3600)(
      target,
      propertyKey,
      descriptor,
    );

    return descriptor;
  };
};

/**
 * Decorator to invalidate cache when data changes
 * Usage: @CacheInvalidate('user:profile')
 */
export const CacheInvalidate = (pattern: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Execute original method first
      const result = await originalMethod.apply(this, args);

      // Invalidate cache after successful execution
      const redisService = this.redisService;
      if (redisService) {
        await redisService.deletePattern(pattern);
      }

      return result;
    };

    return descriptor;
  };
};
