export * from './app.config';
export * from './swagger.config';
export * from './jwt.config';
export * from './telegram-bot.config';
export * from './redis.config';
export * from './typeorm.config';

import { AppConfig } from './app.config';
import { SwaggerConfig } from './swagger.config';
import { JwtConfig } from './jwt.config';
import { I18nConfig } from './i18n.config';
import { TelegramBotConfig } from './telegram-bot.config';
import { RedisConfig } from './redis.config';
import { TypeormConfig } from './typeorm.config';

export const Configs = [
  AppConfig,
  TypeormConfig,
  RedisConfig,
  SwaggerConfig,
  JwtConfig,
  I18nConfig,
  TelegramBotConfig,
];
