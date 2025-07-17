import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TelegramService } from '../services/telegram.service';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    constructor(
        private readonly configService: ConfigService,
    ) { }

    async catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Send error report to Telegram for 500 errors
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            const telegramService = new TelegramService(this.configService);
            await telegramService.sendErrorReport(exception, {
                method: request.method,
                url: request.url,
                headers: request.headers,
                body: request.body,
            });
        }

        // Prepare the error response
        const errorResponse = {
            statusCode: status,
            message: 'Internal server error',
        };

        // Don't expose error details in production
        if (process.env.NODE_ENV === 'development') {
            errorResponse['message'] = exception.message;
        }

        response
            .status(status)
            .send(errorResponse);
    }
} 