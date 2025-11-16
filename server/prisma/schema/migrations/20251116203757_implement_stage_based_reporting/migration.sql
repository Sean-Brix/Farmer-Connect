/*
  Warnings:

  - You are about to drop the column `currentStage` on the `registered_crops` table. All the data in the column will be lost.
  - You are about to drop the column `expectedYield` on the `registered_crops` table. All the data in the column will be lost.
  - Added the required column `stageIndex` to the `crop_monthly_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stageName` to the `crop_monthly_reports` table without a default value. This is not possible if the table is not empty.
  - Made the column `guidelineId` on table `registered_crops` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentStageIndex` on table `registered_crops` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `registered_crops` DROP FOREIGN KEY `registered_crops_guidelineId_fkey`;

-- AlterTable
ALTER TABLE `crop_monthly_reports` ADD COLUMN `stageIndex` INTEGER NOT NULL,
    ADD COLUMN `stageName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `registered_crops` DROP COLUMN `currentStage`,
    DROP COLUMN `expectedYield`,
    ADD COLUMN `canSubmitReport` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `completedStages` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `currentStageEndDate` DATETIME(3) NULL,
    ADD COLUMN `currentStageName` VARCHAR(191) NULL,
    ADD COLUMN `currentStageStartDate` DATETIME(3) NULL,
    ADD COLUMN `lastReportDate` DATETIME(3) NULL,
    ADD COLUMN `totalStages` INTEGER NULL,
    MODIFY `guidelineId` VARCHAR(191) NOT NULL,
    MODIFY `currentStageIndex` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `crop_monthly_reports_cropId_stageIndex_idx` ON `crop_monthly_reports`(`cropId`, `stageIndex`);

-- CreateIndex
CREATE INDEX `registered_crops_currentStageIndex_canSubmitReport_idx` ON `registered_crops`(`currentStageIndex`, `canSubmitReport`);

-- AddForeignKey
ALTER TABLE `registered_crops` ADD CONSTRAINT `registered_crops_guidelineId_fkey` FOREIGN KEY (`guidelineId`) REFERENCES `crop_guidelines`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
