import * as NestConfig from '@nestjs/config';

export const TelegramBotConfig = NestConfig.registerAs('telegramBot', () => ({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  threadId: +(process.env.TELEGRAM_THREAD_ID ?? 2),
}));
