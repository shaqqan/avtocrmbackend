export * from './app.config';
export * from './swagger.config';
export * from './jwt.config';
export * from './telegram-bot.config';
export * from './redis.config';

import { AppConfig } from './app.config';
import { SwaggerConfig } from './swagger.config';
import { JwtConfig } from './jwt.config';
import { I18nConfig } from './i18n.config';
import { TelegramBotConfig } from './telegram-bot.config';
import { RedisConfig } from './redis.config';

export const Configs = [
  AppConfig,
  RedisConfig,
  SwaggerConfig,
  JwtConfig,
  I18nConfig,
  TelegramBotConfig,
];
