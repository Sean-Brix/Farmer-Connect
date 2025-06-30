-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `mimeType` VARCHAR(191) NULL,
    MODIFY `picture` LONGBLOB NULL;
