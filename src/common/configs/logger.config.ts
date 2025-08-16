import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const LoggerConfig = {
  token: 'logger',
  factory: (): winston.LoggerOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        isProduction
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
              nestWinstonModuleUtilities.format.nestLike('Kitob.uz', {
                prettyPrint: true,
                colors: true,
              })
            )
      ),
      transports: [
        // Console transport
        new winston.transports.Console({
          level: isProduction ? 'info' : 'debug',
        }),
        
        // File transport for errors
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
          ),
        }),
        
        // File transport for combined logs
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
          ),
        }),
      ],
      
      // Handle uncaught exceptions and unhandled rejections
      exceptionHandlers: [
        new winston.transports.File({
          filename: 'logs/exceptions.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
      
      rejectionHandlers: [
        new winston.transports.File({
          filename: 'logs/rejections.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
      
      // Exit on error
      exitOnError: false,
    };
  },
};

export type LoggerConfigType = winston.LoggerOptions;
