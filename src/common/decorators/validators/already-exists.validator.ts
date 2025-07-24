import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { PrismaClient } from '@prisma/client/scripts/default-index';
import { ModuleRef } from '@nestjs/core';

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    private prisma: PrismaService;
    constructor(private readonly moduleRef: ModuleRef) {
        this.prisma = this.moduleRef.get(PrismaService, { strict: false });
    }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const [modelName, field] = args.constraints;

        if (!value) return true;

        try {
            const model = await this.getModel(modelName);
            const existingRecord = await model.findFirst({
                where: { [field]: value }
            });

            return !existingRecord;
        } catch (error) {
            console.error(`Validation error for ${modelName}.${field}:`, error);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        const [modelName, field] = args.constraints;
        return args.constraints[2]?.message || `${field} already exists in ${modelName}`;
    }

    private async getModel(modelName: string): Promise<any> {
        // Ensure first letter is uppercase for Prisma models
        const model = await this.prisma.language.findFirst();
        console.log(model);

        return model as any;
    }
}

export function IsUnique(model: string, field: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [model, field],
            validator: IsUniqueConstraint,
        });
    };
}