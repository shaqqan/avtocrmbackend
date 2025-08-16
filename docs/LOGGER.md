# Winston Logger Integration for NestJS

This document describes the Winston logger integration for the Kitob.uz backend project, providing structured logging with different levels, transports, and context-aware logging capabilities.

## Overview

The logger integration provides:
- **Structured logging** with JSON and human-readable formats
- **Multiple log levels** (debug, info, warn, error, verbose, silly)
- **File and console transports** with automatic log rotation
- **Context-aware logging** with request IDs and metadata
- **Automatic HTTP request logging** via interceptors
- **Database operation logging** for performance monitoring
- **Global exception handling** with detailed error logging

## Architecture

```
src/common/
├── configs/
│   └── logger.config.ts          # Winston configuration
├── services/
│   ├── logger.service.ts          # Custom logger service
│   ├── logger.module.ts           # NestJS module integration
│   └── logger-example.service.ts  # Usage examples
├── interceptors/
│   ├── http-logging.interceptor.ts    # HTTP request logging
│   └── database-logging.interceptor.ts # Database operation logging
└── filters/
    └── global-exception.filter.ts     # Global error handling
```

## Configuration

### Environment Variables

The logger automatically adapts based on the `NODE_ENV` environment variable:

- **Development**: Debug level, colored console output, detailed formatting
- **Production**: Info level, JSON format, file logging with rotation

### Log Files

Logs are automatically written to the `logs/` directory:

- `combined.log` - All log levels
- `error.log` - Error level logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

### Log Rotation

- Maximum file size: 5MB
- Maximum files: 5 (rotated automatically)
- Automatic cleanup of old log files

## Usage

### Basic Logging

```typescript
import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../common/services/logger.service';

@Injectable()
export class UserService {
  constructor(private readonly logger: CustomLoggerService) {}

  async createUser(userData: any) {
    this.logger.info('Creating new user', {
      module: 'UserService',
      method: 'createUser',
      userId: userData.id,
    });

    try {
      // User creation logic
      this.logger.info('User created successfully', {
        module: 'UserService',
        method: 'createUser',
        userId: userData.id,
      });
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, {
        module: 'UserService',
        method: 'createUser',
        userId: userData.id,
        error: error.message,
      });
      throw error;
    }
  }
}
```

### Logging with Context

```typescript
// Define context interface
interface LogContext {
  module?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

// Use context in logging
this.logger.info('User action performed', {
  module: 'UserService',
  method: 'performAction',
  userId: 'user_123',
  requestId: 'req_456',
  action: 'profile_update',
  timestamp: new Date().toISOString(),
});
```

### Specialized Logging Methods

#### HTTP Request Logging
```typescript
this.logger.logHttpRequest('POST', '/api/users', 201, 150, {
  module: 'UserController',
  method: 'create',
  userId: 'user_123',
});
```

#### Database Operation Logging
```typescript
this.logger.logDatabaseOperation('SELECT', 'users', 45, {
  module: 'UserRepository',
  method: 'findById',
  userId: 'user_123',
});
```

#### Authentication Event Logging
```typescript
this.logger.logAuthEvent('login_attempt', 'user_123', true, {
  module: 'AuthService',
  method: 'login',
  ip: '192.168.1.1',
});
```

#### Business Event Logging
```typescript
this.logger.logBusinessEvent('user_registration', {
  userId: 'user_123',
  email: 'user@example.com',
  source: 'web_form',
}, {
  module: 'UserService',
  method: 'register',
});
```

#### Performance Metric Logging
```typescript
this.logger.logPerformance('database_query', 150, 'ms', {
  module: 'UserRepository',
  method: 'findByEmail',
  query: 'SELECT * FROM users WHERE email = ?',
});
```

### Child Logger

Create a child logger with additional context:

```typescript
const childLogger = this.logger.createChildLogger({
  module: 'UserService',
  userId: 'user_123',
  sessionId: 'session_456',
});

childLogger.info('This message inherits the parent context');
```

## Automatic Logging

### HTTP Request Logging

The `HttpLoggingInterceptor` automatically logs:
- Incoming requests with method, URL, IP, user agent
- Request body (with sensitive data redaction)
- Response status codes and timing
- Request IDs for correlation

### Database Logging

The `DatabaseLoggingInterceptor` automatically logs:
- Database operation types (SELECT, INSERT, UPDATE, DELETE)
- Operation duration
- Result counts and affected rows
- Database errors with detailed context

### Global Exception Filter

The `GlobalExceptionFilter` automatically logs:
- All unhandled exceptions
- HTTP status codes
- Request context (method, URL, IP, user agent)
- Stack traces and error details

## Log Levels

### Development Mode
- **Debug**: Detailed debugging information
- **Info**: General information messages
- **Warn**: Warning messages
- **Error**: Error messages with stack traces
- **Verbose**: Very detailed information
- **Silly**: Extremely detailed debugging

### Production Mode
- **Info**: General information and above
- **Warn**: Warning messages and above
- **Error**: Error messages and above

## Performance Considerations

### Development
- Console logging with colors and formatting
- Debug level enabled for detailed debugging
- No file I/O overhead

### Production
- JSON format for easy parsing
- File logging with rotation
- Info level only to reduce I/O
- Structured data for log aggregation tools

## Best Practices

### 1. Always Include Context
```typescript
// Good
this.logger.info('User logged in', {
  module: 'AuthService',
  method: 'login',
  userId: user.id,
  ip: request.ip,
});

// Bad
this.logger.info('User logged in');
```

### 2. Use Appropriate Log Levels
```typescript
// Debug: Detailed debugging information
this.logger.debug('SQL query executed', { query, params });

// Info: General information
this.logger.info('User created successfully', { userId });

// Warn: Warning conditions
this.logger.warn('Rate limit approaching', { userId, requests });

// Error: Error conditions
this.logger.error('Database connection failed', error.stack, { userId });
```

### 3. Sanitize Sensitive Data
```typescript
// Sensitive fields are automatically redacted in HTTP logging
// For custom logging, ensure sensitive data is not logged
this.logger.info('User data processed', {
  userId: user.id,
  // Don't log: password, token, secret, etc.
});
```

### 4. Use Request IDs for Correlation
```typescript
// The request ID is automatically added by the HTTP interceptor
// Use it in your logs for correlation
this.logger.info('Processing user request', {
  module: 'UserService',
  method: 'processRequest',
  requestId: request.requestId, // Automatically added
});
```

### 5. Log Business Events
```typescript
// Use specialized methods for business events
this.logger.logBusinessEvent('order_placed', {
  orderId: order.id,
  userId: order.userId,
  total: order.total,
  items: order.items.length,
}, {
  module: 'OrderService',
  method: 'placeOrder',
});
```

## Monitoring and Alerting

### Log Aggregation
- Use tools like ELK Stack, Fluentd, or CloudWatch
- Parse JSON logs for structured analysis
- Create dashboards for monitoring

### Error Alerting
- Monitor error.log for critical errors
- Set up alerts for high error rates
- Track performance metrics from logs

### Performance Monitoring
- Monitor response times from HTTP logs
- Track database query performance
- Identify slow operations and bottlenecks

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check log level configuration
2. **File permissions**: Ensure logs directory is writable
3. **Disk space**: Monitor log file sizes and rotation
4. **Performance impact**: Use appropriate log levels in production

### Debug Mode
Enable debug logging by setting environment variable:
```bash
NODE_ENV=development npm run dev
```

### Log File Locations
- Console: All logs (development)
- `logs/combined.log`: All logs (production)
- `logs/error.log`: Error logs only
- `logs/exceptions.log`: Uncaught exceptions
- `logs/rejections.log`: Unhandled rejections

## Integration with Existing Code

The logger is automatically integrated with:
- HTTP requests via interceptors
- Database operations via interceptors
- Global exception handling
- Application startup and shutdown

To use in existing services, simply inject `CustomLoggerService`:

```typescript
import { CustomLoggerService } from '../common/services/logger.service';

@Injectable()
export class ExistingService {
  constructor(private readonly logger: CustomLoggerService) {}
  
  // Use logger methods as needed
}
```

## Migration from Console.log

Replace console statements with appropriate logger calls:

```typescript
// Before
console.log('User created:', userId);
console.error('Error:', error);

// After
this.logger.info('User created', { userId });
this.logger.error('Error occurred', error.stack, { userId });
```

This provides better structure, context, and integration with the logging system.
