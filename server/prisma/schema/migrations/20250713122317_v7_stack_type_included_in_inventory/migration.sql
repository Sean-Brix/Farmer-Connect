-- AlterTable
ALTER TABLE `item_stacks` ADD COLUMN `adminId` VARCHAR(191) NULL,
    ADD COLUMN `item_stack_type` ENUM('added', 'removed') NOT NULL DEFAULT 'added';

-- AddForeignKey
ALTER TABLE `item_stacks` ADD CONSTRAINT `item_stacks_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
