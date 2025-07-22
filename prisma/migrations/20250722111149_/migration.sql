/*
  Warnings:

  - Added the required column `type` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `type` VARCHAR(191) NOT NULL;
