/*
  Warnings:

  - You are about to drop the column `originalName` on the `languages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `languages` DROP COLUMN `originalName`;

-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `originalName` VARCHAR(191) NULL;
