-- CreateTable
CREATE TABLE `crop_stage_messages` (
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

    INDEX `crop_stage_messages_cropId_createdAt_idx`(`cropId`, `createdAt`),
    INDEX `crop_stage_messages_cropId_stageIndex_idx`(`cropId`, `stageIndex`),
    INDEX `crop_stage_messages_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `crop_stage_messages` ADD CONSTRAINT `crop_stage_messages_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `registered_crops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crop_stage_messages` ADD CONSTRAINT `crop_stage_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crop_stage_messages` ADD CONSTRAINT `crop_stage_messages_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `crop_stage_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
