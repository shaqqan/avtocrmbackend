// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { CustomLoggerService } from '../services/logger.service';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   constructor(private readonly customLogger: CustomLoggerService) {}

//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<FastifyReply>();
//     const request = ctx.getRequest<FastifyRequest>();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';
//     let errorResponse: any = {};

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const exceptionResponse = exception.getResponse();
      
//       if (typeof exceptionResponse === 'string') {
//         message = exceptionResponse;
//       } else if (typeof exceptionResponse === 'object') {
//         message = (exceptionResponse as any).message || exception.message;
//         errorResponse = exceptionResponse;
//       }
//     } else if (exception instanceof Error) {
//       message = exception.message;
//       errorResponse = {
//         name: exception.name,
//         message: exception.message,
//         stack: exception.stack,
//       };
//     }

//     // Log the exception with detailed context
//     this.logger.error(
//       `Unhandled exception: ${message}`,
//       exception instanceof Error ? exception.stack : undefined,
//       {
//         module: 'GlobalExceptionFilter',
//         method: 'catch',
//         type: 'unhandled_exception',
//         requestId: (request as any).requestId,
//         httpMethod: request.method,
//         httpUrl: request.url,
//         statusCode: status,
//         userAgent: request.headers['user-agent'],
//         ip: (request as any).ip,
//         exceptionName: exception instanceof Error ? exception.constructor.name : 'Unknown',
//         exceptionMessage: message,
//         exceptionDetails: errorResponse,
//       }
//     );

//     // Send error response
//     response.status(status).send({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       message: message,
//       ...(process.env.NODE_ENV === 'development' && {
//         error: errorResponse,
//         stack: exception instanceof Error ? exception.stack : undefined,
//       }),
//     });
//   }
// }
