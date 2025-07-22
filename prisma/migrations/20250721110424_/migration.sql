-- DropForeignKey
ALTER TABLE `roles_on_permissions` DROP FOREIGN KEY `roles_on_permissions_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `roles_on_permissions` DROP FOREIGN KEY `roles_on_permissions_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `users_on_permissions` DROP FOREIGN KEY `users_on_permissions_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `users_on_permissions` DROP FOREIGN KEY `users_on_permissions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users_on_roles` DROP FOREIGN KEY `users_on_roles_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `users_on_roles` DROP FOREIGN KEY `users_on_roles_userId_fkey`;

-- DropIndex
DROP INDEX `roles_on_permissions_permissionId_fkey` ON `roles_on_permissions`;

-- DropIndex
DROP INDEX `users_on_permissions_permissionId_fkey` ON `users_on_permissions`;

-- DropIndex
DROP INDEX `users_on_roles_roleId_fkey` ON `users_on_roles`;

-- CreateTable
CREATE TABLE `languages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `languages_name_key`(`name`),
    UNIQUE INDEX `languages_locale_key`(`locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
