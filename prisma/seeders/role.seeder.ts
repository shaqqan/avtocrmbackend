import { PrismaClient, Permission } from '@prisma/client';
import { Role } from '../../src/common/enums/role.enum';

export class RoleSeeder {
    constructor(private prisma: PrismaClient) {}

    async seed(permissions: Permission[]) {
        // Create roles
        const adminRole = await this.prisma.role.upsert({
            where: { name: Role.ADMIN },
            update: {},
            create: { name: Role.ADMIN },
        });

        const userRole = await this.prisma.role.upsert({
            where: { name: Role.USER },
            update: {},
            create: { name: Role.USER },
        });

        const moderatorRole = await this.prisma.role.upsert({
            where: { name: 'MODERATOR' },
            update: {},
            create: { name: 'MODERATOR' },
        });

        // Assign all permissions to admin role
        await this.prisma.rolesOnPermissions.createMany({
            data: permissions.map(permission => ({
                roleId: adminRole.id,
                permissionId: permission.id,
            })),
            skipDuplicates: true,
        });

        // Assign read permissions to user role
        await this.prisma.rolesOnPermissions.createMany({
            data: permissions
                .filter(p => p.name.startsWith('READ_'))
                .map(permission => ({
                    roleId: userRole.id,
                    permissionId: permission.id,
                })),
            skipDuplicates: true,
        });

        // Assign read and update permissions to moderator role
        await this.prisma.rolesOnPermissions.createMany({
            data: permissions
                .filter(p => p.name.startsWith('READ_') || p.name.startsWith('UPDATE_'))
                .map(permission => ({
                    roleId: moderatorRole.id,
                    permissionId: permission.id,
                })),
            skipDuplicates: true,
        });

        return {
            adminRole,
            userRole,
            moderatorRole,
        };
    }
} 