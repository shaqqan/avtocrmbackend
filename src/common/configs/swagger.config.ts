import * as NestConfig from '@nestjs/config';

export const SwaggerConfig = NestConfig.registerAs('swagger', () => ({
    title: process.env.SWAGGER_TITLE || 'Kitob.uz Admin API Documentation',
    description: process.env.SWAGGER_DESCRIPTION || 'The API documentation',
    version: process.env.SWAGGER_VERSION || '0.0.1',
    urlAdmin: process.env.SWAGGER_URL_ADMIN || 'admin/api-docs',
}));