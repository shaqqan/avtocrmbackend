import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ErrorResponse {
    statusCode: number;
    error: string;
    errors: Record<string, string[]>;
}

export class ValidationErrorHandler extends ValidationPipe {
    constructor(private readonly i18n) {
        super({
            skipMissingProperties: false,
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            forbidUnknownValues: false,
            exceptionFactory: (errors: ValidationError[]) =>
                this.createException(errors),
        });
    }

    private async createException(errors: ValidationError[]): Promise<UnprocessableEntityException> {
        const errorResponse: ErrorResponse = {
            statusCode: 422,
            error: 'Unprocessable Entity',
            errors: await this.extractErrors(errors),
        };

        return new UnprocessableEntityException(errorResponse);
    }

    private async extractErrors(
        validationErrors: ValidationError[],
        parentPath = '',
    ): Promise<Record<string, string[]>> {
        const errors: Record<string, string[]> = {};

        // Process all errors concurrently for better performance
        await Promise.all(
            validationErrors.map(async (error) => {
                const propertyPath = this.buildPropertyPath(parentPath, error.property);

                // Handle constraints
                if (error.constraints) {
                    const messages = await this.translateConstraints(error.constraints, error.property, error.value);
                    this.setErrorMessages(errors, propertyPath, parentPath, error.property, messages);
                }
                // Handle nested errors recursively
                if (error.children && error.children.length > 0) {
                    const nestedErrors = await this.extractErrors(error.children, propertyPath);
                    Object.assign(errors, nestedErrors);
                }
            })
        );

        return errors;
    }

    private buildPropertyPath(parentPath: string, property: string): string {
        return parentPath ? `${parentPath}.${property}` : property;
    }

    private async translateConstraints(constraints: Record<string, string>, property: string, value: any): Promise<string[]> {
        const translationPromises = Object.values(constraints).map(async (message) => {
            try {
                const [key, argsStr] = message.split('|');
                const args = argsStr ? JSON.parse(argsStr) : {};
                // Add property name and value to translation args
                args.property = property;
                args.value = value;
                return await this.i18n.translate(key, { args });
            } catch (error) {
                // Fallback to original message if translation fails
                console.warn(`Translation failed for message: ${message}`, error);
                return message;
            }
        });

        return Promise.all(translationPromises);
    }

    private setErrorMessages(
        errors: Record<string, string[]>,
        propertyPath: string,
        parentPath: string,
        property: string,
        messages: string[],
    ): void {
        if (parentPath) {
            // For nested properties, create nested structure
            if (!errors[parentPath]) {
                // @ts-ignore
                errors[parentPath] = {};
            }
            // @ts-ignore
            (errors[parentPath] as Record<string, string[]>)[property] = messages;
        } else {
            // For top-level properties
            errors[propertyPath] = messages;
        }
    }
}