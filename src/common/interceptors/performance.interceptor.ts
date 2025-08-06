import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Performance monitoring interceptor
 * Logs slow requests for optimization
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Log slow requests (> 10ms)
        if (duration > 10) {
          console.warn(
            `🐌 Slow request: ${request.method} ${request.url} - ${duration}ms`,
          );
        }

        // Log extremely fast requests for optimization verification
        if (process.env.NODE_ENV === 'development' && duration <= 5) {
          console.log(
            `⚡ Fast request: ${request.method} ${request.url} - ${duration}ms`,
          );
        }
      }),
    );
  }
}
