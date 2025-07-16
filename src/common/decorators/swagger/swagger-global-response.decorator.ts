import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiGlobalResponses() {
    return applyDecorators(
        ApiResponse({
            status: 400,
            description: 'Bad Request',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 400 },
                    error: { type: 'string', example: 'Bad Request' },
                    message: { type: 'string', example: 'Bad request' },
                },
            },
        }),
        ApiResponse({
            status: 401,
            description: 'Unauthorized',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 401 },
                    error: { type: 'string', example: 'Unauthorized' },
                    message: { type: 'string', example: 'Unauthorized' },
                },
            },
        }),
        ApiResponse({
            status: 403,
            description: 'Forbidden',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 403 },
                    error: { type: 'string', example: 'Forbidden' },
                    message: { type: 'string', example: 'Forbidden' },
                },
            },
        }),
        ApiResponse({
            status: 422,
            description: 'Unprocessable Entity',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 422 },
                    error: { type: 'string', example: 'Unprocessable Entity' },
                    errors: {
                        type: 'object',
                        description: 'Validation errors',
                        additionalProperties: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    },
                },
            },
        }),
        ApiResponse({
            status: 500,
            description: 'Internal Server Error',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 500 },
                    error: { type: 'string', example: 'Internal Server Error' },
                    message: { type: 'string', example: 'Something went wrong' },
                },
            },
        }),
    );
}
