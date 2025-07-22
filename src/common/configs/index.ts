import { AppConfig } from './app.config';
import { TypeormConfig } from './typeorm.config';

export * from './app.config';
export * from './typeorm.config';

export const configs = [AppConfig, TypeormConfig];