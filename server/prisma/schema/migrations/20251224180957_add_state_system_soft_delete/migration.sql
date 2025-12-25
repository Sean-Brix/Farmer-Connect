/*
  Warnings:

  - You are about to drop the column `status` on the `planting_reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropIndex
DROP INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `planting_reports_dateOfPlanting_idx` ON `planting_reports`;

-- DropIndex
DROP INDEX `planting_reports_dateOfPlanting_isArchived_idx` ON `planting_reports`;

-- DropIndex
DROP INDEX `planting_reports_isArchived_idx` ON `planting_reports`;

-- DropIndex
DROP INDEX `planting_reports_rsbsaNumber_idx` ON `planting_reports`;

-- DropIndex
DROP INDEX `planting_reports_typeOfCrop_croppingSeasonId_idx` ON `planting_reports`;

-- DropIndex
DROP INDEX `planting_reports_typeOfCrop_idx` ON `planting_reports`;

-- AlterTable
ALTER TABLE `planting_reports` DROP COLUMN `status`,
    ADD COLUMN `archivedAt` DATETIME(3) NULL,
    ADD COLUMN `archivedBy` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `deletedBy` VARCHAR(191) NULL,
    ADD COLUMN `distributedQuantity` DOUBLE NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `state` ENUM('Request_Report', 'Planted', 'Completed') NOT NULL DEFAULT 'Request_Report',
    ADD COLUMN `stateHistory` JSON NULL,
    MODIFY `plantingMethod` ENUM('Direct_Seeded', 'Transplanting') NULL;

-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `planting_reports_state_isArchived_isDeleted_idx` ON `planting_reports`(`state`, `isArchived`, `isDeleted`);

-- CreateIndex
CREATE INDEX `planting_reports_isDeleted_deletedAt_idx` ON `planting_reports`(`isDeleted`, `deletedAt`);

-- CreateIndex
CREATE INDEX `planting_reports_state_typeOfCrop_idx` ON `planting_reports`(`state`, `typeOfCrop`);

-- CreateIndex
CREATE INDEX `planting_reports_createdAt_idx` ON `planting_reports`(`createdAt`);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
