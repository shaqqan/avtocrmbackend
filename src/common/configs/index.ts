export * from './app.config';
export * from './swagger.config';
export * from './jwt.config';

import { AppConfig } from './app.config';
import { SwaggerConfig } from './swagger.config';
import { JwtConfig } from './jwt.config';

export const Configs = [AppConfig, SwaggerConfig, JwtConfig];
