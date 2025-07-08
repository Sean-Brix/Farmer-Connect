/*
  Warnings:

  - Added the required column `createdById` to the `seminars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seminars` ADD COLUMN `createdById` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `seminars` ADD CONSTRAINT `seminars_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
