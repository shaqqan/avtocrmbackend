import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TelegramService } from '../services/telegram.service';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) { }

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

    // Handle validation errors
    if (exception instanceof UnprocessableEntityException) {
      const validationResponse = exception.getResponse();
      return response.status(status).send(validationResponse);
    }

    // Prepare the error response for other types of errors
    const errorResponse = {
      statusCode: status,
      message: process.env.NODE_ENV === 'development' ? exception.message : 'Internal server error',
    };

    // If it's an HTTP exception, include any additional response data
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        Object.assign(errorResponse, exceptionResponse);
      }
    }

    response.status(status).send(errorResponse);
  }
}
