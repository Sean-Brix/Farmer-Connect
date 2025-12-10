-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropIndex
DROP INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_createdAt_idx` ON `audit_logs`;

-- AlterTable
ALTER TABLE `item_transactions` ADD COLUMN `adjustedReturnDate` DATETIME(3) NULL,
    MODIFY `status` ENUM('Pending', 'Approved', 'Borrowed', 'late_pickup', 'Rejected', 'Returned', 'No_Return', 'late_return', 'No_Pickup', 'Cancelled') NOT NULL DEFAULT 'Pending';

-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
