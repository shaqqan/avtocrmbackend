import { PrismaClient } from '@prisma/client';
import { PermissionSeeder } from './seeders/permission.seeder';
import { RoleSeeder } from './seeders/role.seeder';
import { UserSeeder } from './seeders/user.seeder';
import { LanguageSeeder } from './seeders/language.seeder';

const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

async function main() {
    try {
        // Initialize seeders
        console.log('Initializing seeders...');
        const permissionSeeder = new PermissionSeeder(prisma);
        const roleSeeder = new RoleSeeder(prisma);
        const userSeeder = new UserSeeder(prisma);
        const languageSeeder = new LanguageSeeder(prisma);

        // Run seeders in sequence
        const permissions = await permissionSeeder.seed();
        await roleSeeder.seed(permissions);
        await userSeeder.seed();
        await languageSeeder.seed();

    } catch (error) {
        console.error('\n❌ Seed failed with error:');
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        } else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Failed to seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        console.log('Cleaning up...');
        await prisma.$disconnect();
        console.log('Done.');
    }); 