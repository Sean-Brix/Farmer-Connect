-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropIndex
DROP INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_createdAt_idx` ON `audit_logs`;

-- AlterTable
ALTER TABLE `item_transactions` ADD COLUMN `areaPlanted` DOUBLE NULL,
    ADD COLUMN `farmLocation` VARCHAR(191) NULL,
    ADD COLUMN `plantingMethod` ENUM('Direct_Seeded', 'Transplanting') NULL;

-- AlterTable
ALTER TABLE `planting_reports` ADD COLUMN `distributionItemId` VARCHAR(191) NULL,
    ADD COLUMN `distributionPickupDate` DATETIME(3) NULL,
    ADD COLUMN `distributionQuantity` INTEGER NULL,
    ADD COLUMN `distributionRequestId` VARCHAR(191) NULL,
    ADD COLUMN `distributionUnit` VARCHAR(191) NULL,
    ADD COLUMN `lastUpdatedBy` VARCHAR(191) NULL,
    ADD COLUMN `plantingReportDeadline` DATETIME(3) NULL,
    ADD COLUMN `requestNote` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('Draft', 'Submitted', 'Archived') NOT NULL DEFAULT 'Draft',
    MODIFY `croppingSeasonId` VARCHAR(191) NULL,
    MODIFY `dateOfPlanting` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `planting_reports_distributionRequestId_idx` ON `planting_reports`(`distributionRequestId`);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
