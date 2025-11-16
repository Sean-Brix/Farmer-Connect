-- Manual migration for stage-based reporting system
-- This migration handles existing data safely

-- Step 1: Add new nullable columns to registered_crops first
ALTER TABLE `registered_crops` 
  ADD COLUMN `currentStageIndex` INT NULL,
  ADD COLUMN `currentStageName` VARCHAR(191) NULL,
  ADD COLUMN `currentStageStartDate` DATETIME(3) NULL,
  ADD COLUMN `currentStageEndDate` DATETIME(3) NULL,
  ADD COLUMN `canSubmitReport` BOOLEAN NULL,
  ADD COLUMN `lastReportDate` DATETIME(3) NULL,
  ADD COLUMN `totalStages` INT NULL,
  ADD COLUMN `completedStages` INT NULL;

-- Step 2: Add new nullable columns to crop_monthly_reports
ALTER TABLE `crop_monthly_reports`
  ADD COLUMN `stageIndex` INT NULL,
  ADD COLUMN `stageName` VARCHAR(191) NULL;

-- Step 3: Initialize stage data for existing crops that have guidelines
-- Set default values based on current state
UPDATE `registered_crops` rc
SET 
  `currentStageIndex` = 0,
  `currentStageName` = (
    SELECT gs.stageName 
    FROM `guideline_stages` gs 
    WHERE gs.guidelineId = rc.guidelineId 
    AND gs.stageNumber = 0 
    LIMIT 1
  ),
  `currentStageStartDate` = rc.plantingDate,
  `currentStageEndDate` = DATE_ADD(rc.plantingDate, INTERVAL 30 DAY), -- Default 30 days
  `canSubmitReport` = TRUE,
  `totalStages` = (
    SELECT COUNT(*) 
    FROM `guideline_stages` gs 
    WHERE gs.guidelineId = rc.guidelineId
  ),
  `completedStages` = 0
WHERE rc.guidelineId IS NOT NULL
AND rc.guidelineId IN (SELECT id FROM `crop_guidelines`);

-- Step 4: Initialize stage data for reports based on creation date order
-- This sets stageIndex based on report sequence (0 for first report, 1 for second, etc.)
UPDATE `crop_monthly_reports` cmr
SET 
  `stageIndex` = (
    SELECT COUNT(*) 
    FROM `crop_monthly_reports` cmr2 
    WHERE cmr2.cropId = cmr.cropId 
    AND cmr2.createdAt < cmr.createdAt
  ),
  `stageName` = COALESCE(
    (
      SELECT gs.stageName 
      FROM `guideline_stages` gs 
      INNER JOIN `registered_crops` rc ON rc.guidelineId = gs.guidelineId
      WHERE rc.id = cmr.cropId 
      AND gs.stageNumber = (
        SELECT COUNT(*) 
        FROM `crop_monthly_reports` cmr2 
        WHERE cmr2.cropId = cmr.cropId 
        AND cmr2.createdAt < cmr.createdAt
      )
      LIMIT 1
    ),
    'Unknown Stage'
  );

-- Step 5: Make guideline relation required
-- First, delete any crops without a guideline (orphaned crops)
DELETE FROM `crop_monthly_reports` 
WHERE cropId IN (SELECT id FROM `registered_crops` WHERE guidelineId IS NULL);

DELETE FROM `registered_crops` 
WHERE guidelineId IS NULL;

-- Step 6: Now make the columns NOT NULL with defaults
ALTER TABLE `registered_crops` 
  MODIFY COLUMN `guidelineId` VARCHAR(191) NOT NULL,
  MODIFY COLUMN `currentStageIndex` INT NOT NULL DEFAULT 0,
  MODIFY COLUMN `currentStageName` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
  MODIFY COLUMN `canSubmitReport` BOOLEAN NOT NULL DEFAULT TRUE,
  MODIFY COLUMN `totalStages` INT NOT NULL DEFAULT 0,
  MODIFY COLUMN `completedStages` INT NOT NULL DEFAULT 0;

ALTER TABLE `crop_monthly_reports`
  MODIFY COLUMN `stageIndex` INT NOT NULL DEFAULT 0,
  MODIFY COLUMN `stageName` VARCHAR(191) NOT NULL DEFAULT 'Unknown';

-- Step 7: Drop old columns that are no longer needed
ALTER TABLE `registered_crops` 
  DROP COLUMN `currentStage`,
  DROP COLUMN `expectedYield`;

-- Step 8: Update foreign key constraint to prevent guideline deletion
ALTER TABLE `registered_crops` 
  DROP FOREIGN KEY `registered_crops_guidelineId_fkey`;

ALTER TABLE `registered_crops` 
  ADD CONSTRAINT `registered_crops_guidelineId_fkey` 
  FOREIGN KEY (`guidelineId`) 
  REFERENCES `crop_guidelines`(`id`) 
  ON DELETE RESTRICT 
  ON UPDATE CASCADE;

-- Step 9: Add indexes for performance
CREATE INDEX `registered_crops_currentStageIndex_idx` ON `registered_crops`(`currentStageIndex`);
CREATE INDEX `registered_crops_canSubmitReport_idx` ON `registered_crops`(`canSubmitReport`);
CREATE INDEX `crop_monthly_reports_cropId_stageIndex_idx` ON `crop_monthly_reports`(`cropId`, `stageIndex`);

-- Migration complete!
-- Next step: Run the stage initialization script to properly set up stage dates based on guideline durations
