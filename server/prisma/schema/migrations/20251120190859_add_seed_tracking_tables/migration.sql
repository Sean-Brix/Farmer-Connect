/*
  Warnings:

  - You are about to drop the `crop_monthly_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crop_stage_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registered_crops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report_feedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `crop_monthly_reports` DROP FOREIGN KEY `crop_monthly_reports_cropId_fkey`;

-- DropForeignKey
ALTER TABLE `crop_stage_messages` DROP FOREIGN KEY `crop_stage_messages_cropId_fkey`;

-- DropForeignKey
ALTER TABLE `crop_stage_messages` DROP FOREIGN KEY `crop_stage_messages_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `crop_stage_messages` DROP FOREIGN KEY `crop_stage_messages_userId_fkey`;

-- DropForeignKey
ALTER TABLE `registered_crops` DROP FOREIGN KEY `registered_crops_guidelineId_fkey`;

-- DropForeignKey
ALTER TABLE `registered_crops` DROP FOREIGN KEY `registered_crops_userId_fkey`;

-- DropForeignKey
ALTER TABLE `report_feedback` DROP FOREIGN KEY `report_feedback_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `report_feedback` DROP FOREIGN KEY `report_feedback_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `report_feedback` DROP FOREIGN KEY `report_feedback_reportId_fkey`;

-- DropTable
DROP TABLE `crop_monthly_reports`;

-- DropTable
DROP TABLE `crop_stage_messages`;

-- DropTable
DROP TABLE `registered_crops`;

-- DropTable
DROP TABLE `report_feedback`;

-- CreateTable
CREATE TABLE `RegisteredCrop` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `guidelineId` VARCHAR(191) NOT NULL,
    `cropType` VARCHAR(191) NOT NULL,
    `variety` VARCHAR(191) NOT NULL,
    `plantingDate` DATETIME(3) NOT NULL,
    `expectedHarvest` DATETIME(3) NULL,
    `area` DOUBLE NULL,
    `status` ENUM('Active', 'Inactive', 'Completed', 'Archived') NOT NULL DEFAULT 'Active',
    `currentStageIndex` INTEGER NOT NULL DEFAULT 0,
    `currentStageName` VARCHAR(191) NULL,
    `currentStageStartDate` DATETIME(3) NULL,
    `currentStageEndDate` DATETIME(3) NULL,
    `totalStages` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `archiveReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RegisteredCrop_userId_cropType_status_idx`(`userId`, `cropType`, `status`),
    INDEX `RegisteredCrop_guidelineId_idx`(`guidelineId`),
    INDEX `RegisteredCrop_currentStageIndex_idx`(`currentStageIndex`),
    INDEX `RegisteredCrop_plantingDate_idx`(`plantingDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StageReport` (
    `id` VARCHAR(191) NOT NULL,
    `cropId` VARCHAR(191) NOT NULL,
    `stageIndex` INTEGER NOT NULL,
    `stageName` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Submitted', 'Late') NOT NULL DEFAULT 'Pending',
    `reportDueDate` DATETIME(3) NULL,
    `submittedAt` DATETIME(3) NULL,
    `plantHeight` DOUBLE NULL,
    `healthStatus` VARCHAR(191) NULL,
    `weatherImpact` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `pestsObserved` VARCHAR(191) NULL,
    `diseasesObserved` VARCHAR(191) NULL,
    `fertilizersApplied` VARCHAR(191) NULL,
    `pesticideApplications` VARCHAR(191) NULL,
    `irrigationFrequency` VARCHAR(191) NULL,
    `soilCondition` VARCHAR(191) NULL,
    `plannedActions` VARCHAR(191) NULL,
    `actualYield` DOUBLE NULL,
    `costs` LONGTEXT NULL,
    `weatherSnapshot` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StageReport_cropId_stageIndex_idx`(`cropId`, `stageIndex`),
    INDEX `StageReport_status_reportDueDate_idx`(`status`, `reportDueDate`),
    UNIQUE INDEX `StageReport_cropId_stageIndex_key`(`cropId`, `stageIndex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportFeedback` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReportFeedback_reportId_createdAt_idx`(`reportId`, `createdAt`),
    INDEX `ReportFeedback_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CropStageMessage` (
    `id` VARCHAR(191) NOT NULL,
    `cropId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `stageIndex` INTEGER NOT NULL,
    `stageName` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `isAdminReply` BOOLEAN NOT NULL DEFAULT false,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CropStageMessage_cropId_createdAt_idx`(`cropId`, `createdAt`),
    INDEX `CropStageMessage_cropId_stageIndex_idx`(`cropId`, `stageIndex`),
    INDEX `CropStageMessage_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RegisteredCrop` ADD CONSTRAINT `RegisteredCrop_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegisteredCrop` ADD CONSTRAINT `RegisteredCrop_guidelineId_fkey` FOREIGN KEY (`guidelineId`) REFERENCES `crop_guidelines`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StageReport` ADD CONSTRAINT `StageReport_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `RegisteredCrop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportFeedback` ADD CONSTRAINT `ReportFeedback_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `StageReport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportFeedback` ADD CONSTRAINT `ReportFeedback_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportFeedback` ADD CONSTRAINT `ReportFeedback_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ReportFeedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CropStageMessage` ADD CONSTRAINT `CropStageMessage_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `RegisteredCrop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CropStageMessage` ADD CONSTRAINT `CropStageMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CropStageMessage` ADD CONSTRAINT `CropStageMessage_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `CropStageMessage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
