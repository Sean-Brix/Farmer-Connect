/*
  Warnings:

  - You are about to drop the `crop_guideline_stages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crop_guidelines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cropstagemessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registeredcrop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reportfeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stagereport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `crop_guideline_stages` DROP FOREIGN KEY `crop_guideline_stages_guidelineId_fkey`;

-- DropForeignKey
ALTER TABLE `cropstagemessage` DROP FOREIGN KEY `CropStageMessage_cropId_fkey`;

-- DropForeignKey
ALTER TABLE `cropstagemessage` DROP FOREIGN KEY `CropStageMessage_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `cropstagemessage` DROP FOREIGN KEY `CropStageMessage_userId_fkey`;

-- DropForeignKey
ALTER TABLE `registeredcrop` DROP FOREIGN KEY `RegisteredCrop_guidelineId_fkey`;

-- DropForeignKey
ALTER TABLE `registeredcrop` DROP FOREIGN KEY `RegisteredCrop_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reportfeedback` DROP FOREIGN KEY `ReportFeedback_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `reportfeedback` DROP FOREIGN KEY `ReportFeedback_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `reportfeedback` DROP FOREIGN KEY `ReportFeedback_reportId_fkey`;

-- DropForeignKey
ALTER TABLE `stagereport` DROP FOREIGN KEY `StageReport_cropId_fkey`;

-- DropTable
DROP TABLE `crop_guideline_stages`;

-- DropTable
DROP TABLE `crop_guidelines`;

-- DropTable
DROP TABLE `cropstagemessage`;

-- DropTable
DROP TABLE `registeredcrop`;

-- DropTable
DROP TABLE `reportfeedback`;

-- DropTable
DROP TABLE `stagereport`;

-- CreateTable
CREATE TABLE `planting_reports` (
    `id` VARCHAR(191) NOT NULL,
    `farmerName` VARCHAR(191) NOT NULL,
    `farmLocation` VARCHAR(191) NOT NULL,
    `rsbsaNumber` VARCHAR(191) NULL,
    `croppingSeasonId` VARCHAR(191) NOT NULL,
    `areaPlanted` DOUBLE NOT NULL,
    `seedClassification` ENUM('Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers') NOT NULL,
    `typeOfCrop` ENUM('Rice', 'Corn', 'High_Value_Crops') NOT NULL,
    `riceIrrigation` ENUM('Irrigated', 'Rainfed Lowland') NULL,
    `varietyId` VARCHAR(191) NOT NULL,
    `dateOfPlanting` DATETIME(3) NOT NULL,
    `plantingMethod` ENUM('Direct_Seeded', 'Transplanting') NOT NULL,
    `cropInsurance` BOOLEAN NOT NULL DEFAULT false,
    `harvestArea` DOUBLE NULL,
    `numberOfBags` INTEGER NULL,
    `weightPerBag` DOUBLE NULL,
    `dateOfHarvest` DATETIME(3) NULL,
    `yieldMtPerHa` DOUBLE NULL,
    `dateOfExpectedHarvest` DATETIME(3) NULL,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `planting_reports_croppingSeasonId_idx`(`croppingSeasonId`),
    INDEX `planting_reports_varietyId_idx`(`varietyId`),
    INDEX `planting_reports_typeOfCrop_idx`(`typeOfCrop`),
    INDEX `planting_reports_dateOfPlanting_idx`(`dateOfPlanting`),
    INDEX `planting_reports_dateOfHarvest_idx`(`dateOfHarvest`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planting_seasons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `planting_seasons_name_key`(`name`),
    INDEX `planting_seasons_isActive_idx`(`isActive`),
    INDEX `planting_seasons_startDate_endDate_idx`(`startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seed_varieties` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cropType` ENUM('Rice', 'Corn', 'High_Value_Crops') NOT NULL,
    `DAS` INTEGER NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `seed_varieties_cropType_isActive_idx`(`cropType`, `isActive`),
    UNIQUE INDEX `seed_varieties_name_cropType_key`(`name`, `cropType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `planting_reports` ADD CONSTRAINT `planting_reports_croppingSeasonId_fkey` FOREIGN KEY (`croppingSeasonId`) REFERENCES `planting_seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planting_reports` ADD CONSTRAINT `planting_reports_varietyId_fkey` FOREIGN KEY (`varietyId`) REFERENCES `seed_varieties`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
