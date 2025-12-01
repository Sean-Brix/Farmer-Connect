-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropIndex
DROP INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_createdAt_idx` ON `audit_logs`;

-- AlterTable
ALTER TABLE `item_transactions` ADD COLUMN `actual_pickup` DATETIME(3) NULL,
    ADD COLUMN `actual_return` DATETIME(3) NULL,
    ADD COLUMN `previousStatus` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `item_transactions_status_returnDate_idx` ON `item_transactions`(`status`, `returnDate`);

-- CreateIndex
CREATE INDEX `item_transactions_actual_pickup_idx` ON `item_transactions`(`actual_pickup`);

-- CreateIndex
CREATE INDEX `item_transactions_actual_return_idx` ON `item_transactions`(`actual_return`);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
