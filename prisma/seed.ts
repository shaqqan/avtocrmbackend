import { PrismaClient } from '@prisma/client';
import { Permission } from '../src/common/enums/permission.enum';
import { Role } from '../src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create permissions
  const permissions = Object.values(Permission).map(name => ({ name }));
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

  // Create roles if they don't exist
  const adminRole = await prisma.role.upsert({
    where: { name: Role.ADMIN },
    update: {},
    create: { name: Role.ADMIN },
  });

  const userRole = await prisma.role.upsert({
    where: { name: Role.USER },
    update: {},
    create: { name: Role.USER },
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'MODERATOR' },
    update: {},
    create: { name: 'MODERATOR' },
  });

  // Get all permissions
  const allPermissions = await prisma.permission.findMany();

  // Assign all permissions to admin role
  const adminPermissions = allPermissions.map(permission => ({
    roleId: adminRole.id,
    permissionId: permission.id,
  }));

  await prisma.rolesOnPermissions.createMany({
    data: adminPermissions,
    skipDuplicates: true,
  });

  // Assign basic permissions to user role
  const userPermissions = allPermissions
    .filter(p => p.name.startsWith('READ_'))
    .map(permission => ({
      roleId: userRole.id,
      permissionId: permission.id,
    }));

  await prisma.rolesOnPermissions.createMany({
    data: userPermissions,
    skipDuplicates: true,
  });

  // Assign moderator permissions
  const moderatorPermissions = allPermissions
    .filter(p => p.name.startsWith('READ_') || p.name.startsWith('UPDATE_'))
    .map(permission => ({
      roleId: moderatorRole.id,
      permissionId: permission.id,
    }));

  await prisma.rolesOnPermissions.createMany({
    data: moderatorPermissions,
    skipDuplicates: true,
  });

  // Create users
  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('Password123!', saltRounds);

  // Create admin user
  const adminUser = await prisma.user.upsert({
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
  const moderatorUser = await prisma.user.upsert({
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

  // Create three regular users
  const regularUsers = await Promise.all([
    prisma.user.upsert({
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
    prisma.user.upsert({
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
    prisma.user.upsert({
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

  console.log('Seed completed successfully');
  console.log('Created users:', {
    admin: adminUser.email,
    moderator: moderatorUser.email,
    regularUsers: regularUsers.map(u => u.email),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 