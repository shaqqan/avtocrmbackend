# Database Seeders

This directory contains database seeders for populating initial data in your TypeForm application.

## Available Seeders

### 1. Permission Seeder (`permission.seeder.ts`)
Seeds the database with basic RBAC permissions including:
- User management permissions (create, read, update, delete users)
- Role management permissions (create, read, update, delete roles)
- Permission management permissions (create, read, update, delete permissions)
- System management permissions (manage system, view reports, export data)

### 2. Role Seeder (`role.seeder.ts`)
Seeds the database with predefined roles and their associated permissions:
- **super_admin**: All permissions
- **admin**: Most permissions except system management and permission management
- **moderator**: Read permissions, user updates, and report viewing
- **user**: Basic read permissions for users and roles

### 3. User Seeder (`user.seeder.ts`)
Seeds the database with default users assigned to different roles:
- Super Administrator (superadmin@example.com)
- System Administrator (admin@example.com)
- Content Moderator (moderator@example.com)
- Regular Users (user@example.com, john.doe@example.com, jane.smith@example.com)

## Usage

### Option 1: Use the Main Runner Function
```typescript
import { DataSource } from 'typeorm';
import { runAllSeeders } from './src/databases/typeform/seeders';

// In your application
await runAllSeeders(dataSource);
```

### Option 2: Run Individual Seeders
```typescript
import { DataSource } from 'typeorm';
import { seedPermissions, seedRoles, seedUsers } from './src/databases/typeform/seeders';

// Run in order due to dependencies
await seedPermissions(dataSource);
await seedRoles(dataSource);
await seedUsers(dataSource);
```

### Option 3: Use the Standalone Script
```bash
# Make sure you have ts-node installed
npm install -g ts-node

# Set your database environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export DB_DATABASE=your_database

# Run the seeders
npx ts-node src/databases/typeform/seeders/run-seeders.ts
```

## Environment Variables

The standalone script uses the following environment variables:
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username (default: postgres)
- `DB_PASSWORD`: Database password (default: password)
- `DB_DATABASE`: Database name (default: typeform_db)

## Important Notes

1. **Order Matters**: Seeders must be run in the correct order due to foreign key dependencies:
   - Permissions first (no dependencies)
   - Roles second (depends on permissions)
   - Users last (depends on roles)

2. **Idempotent**: All seeders check if data already exists and skip seeding if records are found.

3. **Error Handling**: Each seeder includes proper error handling and logging.

4. **Database Configuration**: Make sure your database connection is properly configured before running seeders.

## Customization

You can modify the seed data by editing the respective seeder files:
- Add more permissions in `permission.seeder.ts`
- Modify role-permission mappings in `role.seeder.ts`
- Add more default users in `user.seeder.ts`