/*
  Warnings:

  - You are about to drop the column `photo` on the `seminars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `seminars` DROP COLUMN `photo`,
    ADD COLUMN `mimeType` VARCHAR(191) NULL,
    ADD COLUMN `picture` LONGBLOB NULL;
