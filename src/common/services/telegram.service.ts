import { ConfigService, ConfigType } from "@nestjs/config";
import { TelegramBotConfig } from "../configs";

export class TelegramService {
    private readonly botToken: string
    private readonly chatId: string | number
    private readonly threadId: number
    private readonly baseUrl: string;

    constructor(configService: ConfigService) {
        const config = configService.getOrThrow<ConfigType<typeof TelegramBotConfig>>('telegramBot');
        this.botToken = config.botToken as string;
        this.chatId = config.chatId as string | number;
        this.threadId = config.threadId;
        this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    }

    async sendErrorReport(error: Error, request?: any): Promise<void> {
        try {
            const message = this.formatErrorMessage(error, request);
            await fetch(`${this.baseUrl}/sendMessage`, {
                method: 'POST',
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML',
                    message_thread_id: this.threadId,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.error('Failed to send error report to Telegram', err);
        }
    }

    private formatErrorMessage(error: Error, request?: any): string {
        const timestamp = new Date().toLocaleString();
        const environment = process.env.NODE_ENV || 'development';

        let message = `🚨 <b>Error Report</b>\n\n`;
        message += `<b>Environment:</b> ${environment}\n`;
        message += `<b>Timestamp:</b> ${timestamp}\n`;
        message += `<b>Error:</b> <code>${error.message}</code>\n`;

        if (request) {
            message += `\n<b>Request Details:\n`;
            message += `Method: </b> ${request.method}\n`;
            message += `<b>URL:</b> <code>${request.url}</code>\n`;
            message += `<b>User Agent:</b> ${request.headers['user-agent']}\n`;
        }

        if (error.stack) {
            message += `\n<b>Stack Trace:</b>\n`;
            message += `<pre>${error.stack.slice(0, 500)}...</pre>`;
        }

        return message;
    }
} 