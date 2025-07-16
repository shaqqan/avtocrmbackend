import { PrismaClient } from '@prisma/client';
import { Permission } from '../../src/common/enums/permission.enum';

export class PermissionSeeder {
    constructor(private prisma: PrismaClient) { }

    async seed() {
        const permissions = Object.values(Permission).map(name => ({ name }));
        await this.prisma.permission.createMany({
            data: permissions,
            skipDuplicates: true,
        });

        return await this.prisma.permission.findMany();
    }
} 