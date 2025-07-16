import * as NestConfig from '@nestjs/config';

export const SwaggerConfig = NestConfig.registerAs('swagger', () => ({
    title: process.env.SWAGGER_TITLE,
    description: process.env.SWAGGER_DESCRIPTION,
    version: process.env.SWAGGER_VERSION,
    urlAdmin: process.env.SWAGGER_URL_ADMIN,
}));