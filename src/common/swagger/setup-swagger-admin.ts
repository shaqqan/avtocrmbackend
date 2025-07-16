import { ConfigService, ConfigType } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { SwaggerConfig } from '../configs'
import { INestApplication } from '@nestjs/common'
import { AdminModule } from 'src/modules/admin/admin.module'

const markdownDescription = `
# Kitob.uz Admin API Documentation

The API documentation for the Kitob.uz Admin API.
`

export const setupSwaggerAdmin = (app: INestApplication): void => {
    const config = app.get(ConfigService)
    const swagger = config.getOrThrow<ConfigType<typeof SwaggerConfig>>('swagger')

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Kitob.uz Admin API')
        .setDescription('This documentation provides a comprehensive overview of the Kitob.uz Admin API, including available endpoints, request formats, and response structures.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .setContact(
            'Kitob.uz Support Team',
            'https://kitob.uz',
            'support@kitob.uz',
        )
        .setLicense(
            'Proprietary License',
            'https://kitob.uz',
        )
        .setTermsOfService('https://github.com/kitobuz/core-api')
        .addServer('http://10.95.3.14:3000', 'Wi-Fi Network')
        .addServer('http://127.0.0.1:3000', 'Local Development Server')
        .addServer('https://api.kitob.uz', 'Production Server')
        .addGlobalParameters({
            name: 'x-lang',
            in: 'header',
            required: false,
            description: 'Language preference header. Supported values: uz, ru, en, kaa.',
            schema: {
                type: 'string',
                example: 'kaa',
            },
        })
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
        // include: [AdminModule],
    })
    app.use('/api-docs-json/', (req: Request, res: Response) => res.send(document))

    SwaggerModule.setup(swagger.urlAdmin || '/api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: swagger.title,
        customCss: '.swagger-container .swagger-ui { max-width: 900px; margin: 0 auto; }',
    })
}