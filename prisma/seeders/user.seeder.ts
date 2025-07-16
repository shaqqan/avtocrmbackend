import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums';

export class UserSeeder {
    constructor(private prisma: PrismaClient) { }

    async seed() {
        const saltRounds = 10;
        const defaultPassword = await bcrypt.hash('Password123!', saltRounds);

        // Create admin user
        const adminUser = await this.prisma.user.upsert({
            where: { email: 'admin@kitob.uz' },
            update: {},
            create: {
                email: 'admin@kitob.uz',
                password: defaultPassword,
                firstName: 'Admin',
                lastName: 'User',
                roles: {
                    create: [{ role: { connect: { name: Role.ADMIN } } }]
                }
            },
        });

        // Create moderator user
        const moderatorUser = await this.prisma.user.upsert({
            where: { email: 'moderator@kitob.uz' },
            update: {},
            create: {
                email: 'moderator@kitob.uz',
                password: defaultPassword,
                firstName: 'Moderator',
                lastName: 'User',
                roles: {
                    create: [{ role: { connect: { name: 'MODERATOR' } } }]
                }
            },
        });

        // Create regular users
        const regularUsers = await Promise.all([
            this.prisma.user.upsert({
                where: { email: 'user1@kitob.uz' },
                update: {},
                create: {
                    email: 'user1@kitob.uz',
                    password: defaultPassword,
                    firstName: 'First',
                    lastName: 'User',
                    roles: {
                        create: [{ role: { connect: { name: Role.USER } } }]
                    }
                },
            }),
            this.prisma.user.upsert({
                where: { email: 'user2@kitob.uz' },
                update: {},
                create: {
                    email: 'user2@kitob.uz',
                    password: defaultPassword,
                    firstName: 'Second',
                    lastName: 'User',
                    roles: {
                        create: [{ role: { connect: { name: Role.USER } } }]
                    }
                },
            }),
            this.prisma.user.upsert({
                where: { email: 'user3@kitob.uz' },
                update: {},
                create: {
                    email: 'user3@kitob.uz',
                    password: defaultPassword,
                    firstName: 'Third',
                    lastName: 'User',
                    roles: {
                        create: [{ role: { connect: { name: Role.USER } } }]
                    }
                },
            }),
        ]);

        return {
            adminUser,
            moderatorUser,
            regularUsers,
        };
    }
} 