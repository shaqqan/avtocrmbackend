/*
  Warnings:

  - You are about to drop the column `icon` on the `languages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `languages` DROP COLUMN `icon`,
    ADD COLUMN `iconId` INTEGER NULL;
