import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TelegramService } from '../services/telegram.service';
import { ConfigService } from '@nestjs/config';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService, private readonly i18n) { }

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof QueryFailedError) {
      const error = exception.driverError;

      // 1062 duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        return response.status(HttpStatus.CONFLICT).send({
          statusCode: HttpStatus.CONFLICT,
          message: this.i18n.t('errors.VALIDATION.ALREADY_EXISTS'),
        });
      }

      // 1452 foreign key constraint fails
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return response.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.i18n.t('errors.VALIDATION.FOREIGN_KEY_CONSTRAINT_FAILED'),
        });
      }

      // 1048 column 'name' cannot be null
      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        return response.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.i18n.t('errors.VALIDATION.COLUMN_CANNOT_BE_NULL'),
        });
      }

      return response.status(status).send({
        statusCode: status,
        message: exception.message,
      });
    }

    // Send error report to Telegram for 500 errors
    if (status === HttpStatus.INTERNAL_SERVER_ERROR && process.env.NODE_ENV !== 'locale') {
      console.log(exception);
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
