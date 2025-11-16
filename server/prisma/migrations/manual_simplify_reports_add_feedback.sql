-- Migration: simplify_reports_add_feedback
-- Description: Simplifies CropMonthlyReport model and adds ReportFeedback for admin-farmer communication
-- 
-- IMPORTANT: This migration will drop data from removed columns!
-- Before running, ensure you have backed up any important data from:
--   - reportDate (data will be lost, use createdAt instead)
--   - growthStage (data will be lost)
--   - estimatedYield (data will be lost)
--   - majorActivities (data will be lost)
--   - challenges (data will be lost)
--   - submissionDate (data will be lost, use createdAt instead)

-- CreateTable: report_feedback
CREATE TABLE `report_feedback` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `report_feedback_reportId_createdAt_idx`(`reportId`, `createdAt`),
    INDEX `report_feedback_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `report_feedback` ADD CONSTRAINT `report_feedback_reportId_fkey` 
    FOREIGN KEY (`reportId`) REFERENCES `crop_monthly_reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_feedback` ADD CONSTRAINT `report_feedback_authorId_fkey` 
    FOREIGN KEY (`authorId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_feedback` ADD CONSTRAINT `report_feedback_parentId_fkey` 
    FOREIGN KEY (`parentId`) REFERENCES `report_feedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Remove columns from crop_monthly_reports
ALTER TABLE `crop_monthly_reports` 
    DROP COLUMN `reportDate`,
    DROP COLUMN `growthStage`,
    DROP COLUMN `estimatedYield`,
    DROP COLUMN `majorActivities`,
    DROP COLUMN `challenges`,
    DROP COLUMN `submissionDate`;

-- DropIndex: Remove old index on reportDate
-- Note: MySQL syntax - adjust if using PostgreSQL
DROP INDEX `crop_monthly_reports_cropId_reportDate_idx` ON `crop_monthly_reports`;

-- CreateIndex: Add new index on createdAt
CREATE INDEX `crop_monthly_reports_cropId_createdAt_idx` ON `crop_monthly_reports`(`cropId`, `createdAt`);
