-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_adminId_fkey`;

-- DropIndex
DROP INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`;

-- DropIndex
DROP INDEX `audit_logs_createdAt_idx` ON `audit_logs`;

-- CreateTable
CREATE TABLE `distribution_quotas` (
    `id` VARCHAR(191) NOT NULL,
    `itemStackId` VARCHAR(191) NOT NULL,
    `maxPerUser` INTEGER NOT NULL DEFAULT 1,
    `maxRequestsPerMonth` INTEGER NOT NULL DEFAULT 1,
    `cooldownDays` INTEGER NOT NULL DEFAULT 30,
    `eligibilityCriteria` JSON NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `distribution_quotas_itemStackId_key`(`itemStackId`),
    INDEX `distribution_quotas_itemStackId_idx`(`itemStackId`),
    INDEX `distribution_quotas_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distribution_history` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `itemStackId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transactionId` VARCHAR(191) NULL,

    INDEX `distribution_history_accountId_itemStackId_idx`(`accountId`, `itemStackId`),
    INDEX `distribution_history_accountId_receivedAt_idx`(`accountId`, `receivedAt`),
    INDEX `distribution_history_itemStackId_idx`(`itemStackId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distribution_waitlist` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `itemStackId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `position` INTEGER NOT NULL,
    `notified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `distribution_waitlist_itemStackId_position_idx`(`itemStackId`, `position`),
    INDEX `distribution_waitlist_expiresAt_idx`(`expiresAt`),
    INDEX `distribution_waitlist_notified_idx`(`notified`),
    UNIQUE INDEX `distribution_waitlist_accountId_itemStackId_key`(`accountId`, `itemStackId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `audit_logs_createdAt_idx` ON `audit_logs`(`createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_adminId_createdAt_idx` ON `audit_logs`(`adminId`, `createdAt` DESC);

-- CreateIndex
CREATE INDEX `audit_logs_action_createdAt_idx` ON `audit_logs`(`action`, `createdAt` DESC);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_quotas` ADD CONSTRAINT `distribution_quotas_itemStackId_fkey` FOREIGN KEY (`itemStackId`) REFERENCES `item_stacks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_history` ADD CONSTRAINT `distribution_history_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_history` ADD CONSTRAINT `distribution_history_itemStackId_fkey` FOREIGN KEY (`itemStackId`) REFERENCES `item_stacks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_waitlist` ADD CONSTRAINT `distribution_waitlist_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `distribution_waitlist` ADD CONSTRAINT `distribution_waitlist_itemStackId_fkey` FOREIGN KEY (`itemStackId`) REFERENCES `item_stacks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
