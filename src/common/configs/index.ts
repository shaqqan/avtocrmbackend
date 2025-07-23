import { AppConfig } from './app.config';
import { RedisConfig } from './redis.config';
import { TypeormConfig } from './typeorm.config';

export * from './app.config';
export * from './typeorm.config';
export * from './redis.config';

export const configs = [AppConfig, TypeormConfig, RedisConfig];