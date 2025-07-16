import { PrismaClient } from '@prisma/client';
import { PermissionSeeder } from './seeders/permission.seeder';
import { RoleSeeder } from './seeders/role.seeder';
import { UserSeeder } from './seeders/user.seeder';

const prisma = new PrismaClient();

async function main() {
    try {
        // Initialize seeders
        const permissionSeeder = new PermissionSeeder(prisma);
        const roleSeeder = new RoleSeeder(prisma);
        const userSeeder = new UserSeeder(prisma);

        // Run seeders in sequence
        console.log('Seeding permissions...');
        const permissions = await permissionSeeder.seed();

        console.log('Seeding roles...');
        await roleSeeder.seed(permissions);

        console.log('Seeding users...');
        const { adminUser, moderatorUser, regularUsers } = await userSeeder.seed();

        console.log('Seed completed successfully');
        console.log('Created users:', {
            admin: adminUser.email,
            moderator: moderatorUser.email,
            regularUsers: regularUsers.map(u => u.email),
        });
    } catch (error) {
        console.error('Seed failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 