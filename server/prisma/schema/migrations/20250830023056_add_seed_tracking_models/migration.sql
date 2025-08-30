-- CreateTable
CREATE TABLE `registered_crops` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cropType` VARCHAR(191) NOT NULL,
    `variety` VARCHAR(191) NOT NULL,
    `plantingDate` DATETIME(3) NOT NULL,
    `expectedHarvest` DATETIME(3) NULL,
    `area` DOUBLE NULL,
    `status` ENUM('Active', 'Inactive', 'Completed', 'Archived') NOT NULL DEFAULT 'Active',
    `currentStage` ENUM('Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Harvested') NOT NULL DEFAULT 'Seedling',
    `expectedYield` DOUBLE NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `registered_crops_userId_cropType_status_idx`(`userId`, `cropType`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crop_monthly_reports` (
    `id` VARCHAR(191) NOT NULL,
    `cropId` VARCHAR(191) NOT NULL,
    `reportDate` DATETIME(3) NOT NULL,
    `growthStage` ENUM('Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Harvested') NOT NULL,
    `plantHeight` DOUBLE NULL,
    `healthStatus` VARCHAR(191) NULL,
    `estimatedYield` DOUBLE NULL,
    `weatherImpact` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `pestsObserved` VARCHAR(191) NULL,
    `diseasesObserved` VARCHAR(191) NULL,
    `fertilizersApplied` VARCHAR(191) NULL,
    `pesticideApplications` VARCHAR(191) NULL,
    `irrigationFrequency` VARCHAR(191) NULL,
    `soilCondition` VARCHAR(191) NULL,
    `majorActivities` VARCHAR(191) NULL,
    `challenges` VARCHAR(191) NULL,
    `plannedActions` VARCHAR(191) NULL,
    `actualYield` DOUBLE NULL,
    `costs` JSON NULL,
    `submissionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `weatherSnapshot` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `crop_monthly_reports_cropId_reportDate_idx`(`cropId`, `reportDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registered_crops` ADD CONSTRAINT `registered_crops_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crop_monthly_reports` ADD CONSTRAINT `crop_monthly_reports_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `registered_crops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
