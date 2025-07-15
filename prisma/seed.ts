import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // First, create some roles
    const roles = await Promise.all([
        prisma.role.upsert({
            where: { name: 'ADMIN' },
            update: {},
            create: { name: 'ADMIN' },
        }),
        prisma.role.upsert({
            where: { name: 'USER' },
            update: {},
            create: { name: 'USER' },
        }),
    ]);

    // Create some users
    const users = await Promise.all([
        prisma.user.upsert({
            where: { email: 'admin@kitob.uz' },
            update: {},
            create: {
                email: 'admin@kitob.uz',
                firstName: 'Admin',
                lastName: 'User',
                password: await bcrypt.hash('Admin123!', 10),
                roles: {
                    create: [
                        {
                            role: {
                                connect: {
                                    name: 'ADMIN',
                                },
                            },
                        },
                    ],
                },
            },
        }),
        prisma.user.upsert({
            where: { email: 'user@kitob.uz' },
            update: {},
            create: {
                email: 'user@kitob.uz',
                firstName: 'Regular',
                lastName: 'User',
                password: await bcrypt.hash('User123!', 10),
                roles: {
                    create: [
                        {
                            role: {
                                connect: {
                                    name: 'USER',
                                },
                            },
                        },
                    ],
                },
            },
        }),
    ]);

    console.log({ roles, users });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 