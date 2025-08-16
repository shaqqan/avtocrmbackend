import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DatabaseLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const requestId = request.requestId;
    
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          
          // Log database operations if they exist in the response
          if (data && typeof data === 'object') {
            this.logDatabaseOperations(data, duration, {
              module: 'DatabaseLoggingInterceptor',
              method: 'intercept',
              requestId,
              httpMethod: method,
              httpUrl: url,
            });
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          
          // Log database errors
          if (error.code && (error.code.startsWith('ER_') || error.code.startsWith('SQLSTATE'))) {
            this.logger.error(
              `Database operation failed after ${duration}ms`,
              error.stack,
              {
                module: 'DatabaseLoggingInterceptor',
                method: 'intercept',
                requestId,
                httpMethod: method,
                httpUrl: url,
                type: 'database_error',
                errorCode: error.code,
                errorMessage: error.message,
                duration,
              }
            );
          }
        },
      })
    );
  }

  private logDatabaseOperations(data: any, duration: number, context: any): void {
    // Check if the response contains database-related information
    if (data.affectedRows !== undefined) {
      this.logger.log(
        `Database UPDATE/DELETE operation completed in ${duration}ms`,
        {
          ...context,
          operation: 'UPDATE/DELETE',
          table: 'unknown_table',
          duration,
          affectedRows: data.affectedRows,
        }
      );
    }

    if (data.insertId !== undefined) {
      this.logger.log(
        `Database INSERT operation completed in ${duration}ms`,
        {
          ...context,
          operation: 'INSERT',
          table: 'unknown_table',
          duration,
          insertId: data.insertId,
        }
      );
    }

    if (Array.isArray(data) && data.length > 0) {
      this.logger.log(
        `Database SELECT operation completed in ${duration}ms`,
        {
          ...context,
          operation: 'SELECT',
          table: 'unknown_table',
          duration,
          resultCount: data.length,
        }
      );
    }

    // Log if it's a single object result
    if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
      this.logger.log(
        `Database SELECT operation completed in ${duration}ms`,
        {
          ...context,
          operation: 'SELECT',
          table: 'unknown_table',
          duration,
          resultCount: 1,
        }
      );
    }
  }
}
