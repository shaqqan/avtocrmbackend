import { ConfigService, ConfigType } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from '../configs';
import { INestApplication } from '@nestjs/common';

export const setupSwaggerAdmin = (app: INestApplication): void => {
  const config = app.get(ConfigService);
  const swagger =
    config.getOrThrow<ConfigType<typeof SwaggerConfig>>('swagger');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kitob.uz Admin API')
    .setDescription(
      'This documentation provides a comprehensive overview of the Kitob.uz Admin API, including available endpoints, request formats, and response structures.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .setContact('Kitob.uz Support Team', 'https://kitob.uz', 'support@kitob.uz')
    .setLicense('Proprietary License', 'https://kitob.uz')
    .addServer('http://127.0.0.1:3000', 'Local Development Server')
    .addServer('http://10.95.3.18:3000', 'Wi-Fi Network')
    .addServer('https://api.kitob.uz', 'Production Server')
    .addGlobalParameters({
      name: 'x-lang',
      in: 'header',
      required: false,
      description:
        'Language preference header. Supported values: uz, ru, en, kaa.',
      schema: {
        type: 'string',
        example: 'uz',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    // include: [AdminModule],
  });

  SwaggerModule.setup(swagger.urlAdmin || '/api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    explorer: true,
    jsonDocumentUrl: '/admin/api-docs-json/',
    yamlDocumentUrl: '/admin/api-docs-yaml/',
    swaggerUiEnabled: true,
    ui: true,
    raw: ['json', 'yaml'],
    swaggerUrl: '/admin/api-docs-json/',
    customSiteTitle: swagger.title,
    customCss:
      '.swagger-container .swagger-ui { max-width: 900px; margin: 0 auto; }',
  });
};
