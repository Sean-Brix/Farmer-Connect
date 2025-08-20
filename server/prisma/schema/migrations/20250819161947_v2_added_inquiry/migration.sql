-- CreateTable
CREATE TABLE `inquiries` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `category` ENUM('GENERAL', 'SEMINAR', 'EQUIPMENT', 'ACCOUNT', 'TECHNICAL', 'FEEDBACK', 'COMPLAINT') NOT NULL DEFAULT 'GENERAL',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('PENDING', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `userId` VARCHAR(191) NULL,
    `guestName` VARCHAR(191) NULL,
    `guestEmail` VARCHAR(191) NULL,
    `assignedToId` VARCHAR(191) NULL,
    `resolvedById` VARCHAR(191) NULL,
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inquiries_status_idx`(`status`),
    INDEX `inquiries_category_idx`(`category`),
    INDEX `inquiries_priority_idx`(`priority`),
    INDEX `inquiries_userId_idx`(`userId`),
    INDEX `inquiries_assignedToId_idx`(`assignedToId`),
    INDEX `inquiries_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_replies` (
    `id` VARCHAR(191) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `isInternal` BOOLEAN NOT NULL DEFAULT false,
    `senderId` VARCHAR(191) NULL,
    `senderType` ENUM('USER', 'ADMIN', 'SYSTEM', 'BOT') NOT NULL,
    `senderName` VARCHAR(191) NULL,
    `inquiryId` VARCHAR(191) NOT NULL,
    `parentReplyId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `readByUser` BOOLEAN NOT NULL DEFAULT false,
    `readByAdmin` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,

    INDEX `inquiry_replies_inquiryId_idx`(`inquiryId`),
    INDEX `inquiry_replies_senderId_idx`(`senderId`),
    INDEX `inquiry_replies_createdAt_idx`(`createdAt`),
    INDEX `inquiry_replies_senderType_idx`(`senderType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `filepath` VARCHAR(191) NOT NULL,
    `filesize` INTEGER NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `inquiryId` VARCHAR(191) NOT NULL,
    `uploadedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inquiry_attachments_inquiryId_idx`(`inquiryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` LONGTEXT NOT NULL,
    `category` ENUM('GENERAL', 'SEMINAR', 'EQUIPMENT', 'ACCOUNT', 'TECHNICAL', 'FEEDBACK', 'COMPLAINT') NOT NULL DEFAULT 'GENERAL',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `helpfulCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `faqs_category_idx`(`category`),
    INDEX `faqs_isActive_idx`(`isActive`),
    INDEX `faqs_orderIndex_idx`(`orderIndex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_templates` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `category` ENUM('GENERAL', 'SEMINAR', 'EQUIPMENT', 'ACCOUNT', 'TECHNICAL', 'FEEDBACK', 'COMPLAINT') NOT NULL DEFAULT 'GENERAL',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inquiry_templates_category_idx`(`category`),
    INDEX `inquiry_templates_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_notifications` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('NEW_INQUIRY', 'NEW_REPLY', 'STATUS_CHANGE', 'ASSIGNMENT_CHANGE', 'INQUIRY_RESOLVED', 'INQUIRY_CLOSED', 'MENTION', 'REMINDER') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `inquiryId` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inquiry_notifications_userId_idx`(`userId`),
    INDEX `inquiry_notifications_isRead_idx`(`isRead`),
    INDEX `inquiry_notifications_type_idx`(`type`),
    INDEX `inquiry_notifications_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_analytics` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `totalInquiries` INTEGER NOT NULL DEFAULT 0,
    `pendingInquiries` INTEGER NOT NULL DEFAULT 0,
    `resolvedInquiries` INTEGER NOT NULL DEFAULT 0,
    `avgFirstResponseTime` DOUBLE NULL,
    `avgResolutionTime` DOUBLE NULL,
    `seminarInquiries` INTEGER NOT NULL DEFAULT 0,
    `equipmentInquiries` INTEGER NOT NULL DEFAULT 0,
    `accountInquiries` INTEGER NOT NULL DEFAULT 0,
    `generalInquiries` INTEGER NOT NULL DEFAULT 0,
    `lowPriorityCount` INTEGER NOT NULL DEFAULT 0,
    `mediumPriorityCount` INTEGER NOT NULL DEFAULT 0,
    `highPriorityCount` INTEGER NOT NULL DEFAULT 0,
    `urgentPriorityCount` INTEGER NOT NULL DEFAULT 0,
    `adminId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inquiry_analytics_date_idx`(`date`),
    INDEX `inquiry_analytics_adminId_idx`(`adminId`),
    UNIQUE INDEX `inquiry_analytics_date_adminId_key`(`date`, `adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_resolvedById_fkey` FOREIGN KEY (`resolvedById`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_replies` ADD CONSTRAINT `inquiry_replies_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_replies` ADD CONSTRAINT `inquiry_replies_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `inquiries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_replies` ADD CONSTRAINT `inquiry_replies_parentReplyId_fkey` FOREIGN KEY (`parentReplyId`) REFERENCES `inquiry_replies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_attachments` ADD CONSTRAINT `inquiry_attachments_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `inquiries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_attachments` ADD CONSTRAINT `inquiry_attachments_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faqs` ADD CONSTRAINT `faqs_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_templates` ADD CONSTRAINT `inquiry_templates_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_notifications` ADD CONSTRAINT `inquiry_notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_notifications` ADD CONSTRAINT `inquiry_notifications_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `inquiries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_analytics` ADD CONSTRAINT `inquiry_analytics_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
