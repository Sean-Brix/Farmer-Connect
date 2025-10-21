-- AlterTable
ALTER TABLE `registered_crops` ADD COLUMN `archiveReason` VARCHAR(191) NULL,
    ADD COLUMN `guidelineId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `crop_guidelines` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('Cereals', 'Vegetables', 'Fruits', 'Legumes', 'Root_Crops', 'Herbs_Spices') NOT NULL,
    `varieties` LONGTEXT NOT NULL,
    `plantingSeasons` LONGTEXT NOT NULL,
    `growingPeriod` VARCHAR(191) NOT NULL,
    `waterRequirements` VARCHAR(191) NOT NULL,
    `expectedYield` VARCHAR(191) NOT NULL,
    `soilType` VARCHAR(191) NOT NULL,
    `climate` VARCHAR(191) NOT NULL,
    `spacing` VARCHAR(191) NOT NULL,
    `fertilizer` VARCHAR(191) NOT NULL,
    `keyTips` LONGTEXT NOT NULL,
    `commonPests` LONGTEXT NOT NULL,
    `diseases` LONGTEXT NOT NULL,
    `marketPrice` VARCHAR(191) NOT NULL,
    `profitability` ENUM('Low', 'Moderate', 'High', 'Very_High') NOT NULL,
    `difficulty` ENUM('Easy', 'Moderate', 'Moderate_High', 'High') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `crop_guidelines_name_key`(`name`),
    INDEX `crop_guidelines_category_isActive_idx`(`category`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crop_guideline_stages` (
    `id` VARCHAR(191) NOT NULL,
    `guidelineId` VARCHAR(191) NOT NULL,
    `stageName` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `activities` LONGTEXT NOT NULL,
    `sequenceOrder` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `crop_guideline_stages_guidelineId_sequenceOrder_idx`(`guidelineId`, `sequenceOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `registered_crops_guidelineId_idx` ON `registered_crops`(`guidelineId`);

-- AddForeignKey
ALTER TABLE `crop_guideline_stages` ADD CONSTRAINT `crop_guideline_stages_guidelineId_fkey` FOREIGN KEY (`guidelineId`) REFERENCES `crop_guidelines`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registered_crops` ADD CONSTRAINT `registered_crops_guidelineId_fkey` FOREIGN KEY (`guidelineId`) REFERENCES `crop_guidelines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
