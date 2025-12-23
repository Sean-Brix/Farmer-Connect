-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropIndex
DROP INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_createdAt_idx` ON `audit_logs`;

-- AlterTable
ALTER TABLE `inventory_items` ADD COLUMN `seedVarietyId` VARCHAR(191) NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL,
    MODIFY `category` ENUM('Farming_Equipment', 'Harvesting_Tools', 'Irrigation_Systems', 'Storage_Equipment', 'Processing_Equipment', 'Safety_Gear', 'Pest_Control', 'Livestock_Equipment', 'Measuring_Tools', 'Fisheries', 'Machinery', 'Seeds', 'Other') NOT NULL DEFAULT 'Other';

-- AlterTable
ALTER TABLE `item_transactions` ADD COLUMN `plantingReportArchivedAt` DATETIME(3) NULL,
    ADD COLUMN `plantingReportDeadline` DATETIME(3) NULL,
    ADD COLUMN `plantingReportId` VARCHAR(191) NULL,
    ADD COLUMN `plantingReportRequired` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `plantingReportSubmittedAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('Pending', 'Approved', 'Borrowed', 'late_pickup', 'Rejected', 'Returned', 'No_Return', 'late_return', 'No_Pickup', 'Cancelled', 'Picked_Up', 'Planted', 'Archived') NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `seed_varieties` ADD COLUMN `plantingWindow` INTEGER NOT NULL DEFAULT 30;

-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_items` ADD CONSTRAINT `inventory_items_seedVarietyId_fkey` FOREIGN KEY (`seedVarietyId`) REFERENCES `seed_varieties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_plantingReportId_fkey` FOREIGN KEY (`plantingReportId`) REFERENCES `planting_reports`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
