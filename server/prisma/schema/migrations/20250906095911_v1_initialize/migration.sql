-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `access` ENUM('Admin', 'User', 'Super Admin') NOT NULL DEFAULT 'User',
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NOT NULL,
    `extensionName` VARCHAR(191) NULL,
    `sex` ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Other',
    `street` VARCHAR(191) NULL,
    `barangay` VARCHAR(191) NULL,
    `municipality` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `houseNumber` VARCHAR(191) NULL,
    `mobileNumber` VARCHAR(191) NULL,
    `landlineNumber` VARCHAR(191) NULL,
    `birthMunicipality` VARCHAR(191) NULL,
    `birthProvince` VARCHAR(191) NULL,
    `birthCountry` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `religion` VARCHAR(191) NULL,
    `otherReligionSpecify` VARCHAR(191) NULL,
    `civilStatus` VARCHAR(191) NULL,
    `spouseName` VARCHAR(191) NULL,
    `femaleHouseholdMembers` VARCHAR(191) NULL,
    `maleHouseholdMembers` VARCHAR(191) NULL,
    `isHouseholdHead` BOOLEAN NULL,
    `householdHeadName` VARCHAR(191) NULL,
    `relationshipToHead` ENUM('Son', 'Daughter', 'Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Grandchild', 'Son-in-law', 'Daughter-in-law', 'Other relative') NULL,
    `hasGovId` BOOLEAN NULL,
    `govIdType` ENUM('National ID', 'Drivers License', 'Passport', 'Voters ID', 'School ID', 'SSS ID', 'PhilHealth ID', 'TIN ID', 'PRC ID', 'Senior Citizen ID', 'PWD ID', 'Other') NULL,
    `govIdNumber` VARCHAR(191) NULL,
    `education` ENUM('No formal education', 'Kinder', 'Elementary level', 'Elementary graduate', 'High school level', 'High school graduate', 'Senior high school level', 'Senior high school graduate', 'College level', 'College graduate', 'Post-graduate studies', 'Vocational/Technical') NULL,
    `isPWD` BOOLEAN NULL,
    `disabilityType` VARCHAR(191) NULL,
    `livelihoodProfile` JSON NULL,
    `farmingActivities` JSON NULL,
    `fishingActivities` JSON NULL,
    `farmworkActivities` JSON NULL,
    `youthActivities` JSON NULL,
    `otherCropsSpecify` VARCHAR(191) NULL,
    `livestockSpecify` VARCHAR(191) NULL,
    `fishingOthersSpecify` VARCHAR(191) NULL,
    `farmworkOthersSpecify` VARCHAR(191) NULL,
    `youthOthersSpecify` VARCHAR(191) NULL,
    `grossAnnualIncome` VARCHAR(191) NULL,
    `incomeSource` ENUM('farming', 'non-farming') NULL,
    `picture` LONGBLOB NULL,
    `mimeType` VARCHAR(191) NULL,
    `resetTokenHash` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `client_profile` ENUM('Fishfolk', 'Rural Based Org', 'Student', 'Agricultural/Fisheries Technician', 'Youth', 'Women', 'Govt Employee', 'PWD', 'Indigenous People', 'Other') NOT NULL DEFAULT 'Other',
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `accounts_username_key`(`username`),
    UNIQUE INDEX `accounts_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `action` ENUM('ACCOUNT_CREATE', 'ACCOUNT_UPDATE', 'ACCOUNT_DELETE', 'ACCOUNT_ROLE_CHANGE', 'ACCOUNT_STATUS_CHANGE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'INVENTORY_CREATE', 'INVENTORY_UPDATE', 'INVENTORY_DELETE', 'INVENTORY_STATUS_CHANGE', 'DISTRIBUTION_CREATE', 'DISTRIBUTION_UPDATE', 'DISTRIBUTION_DELETE', 'DISTRIBUTION_REQUEST_APPROVE', 'DISTRIBUTION_REQUEST_REJECT', 'DISTRIBUTION_REQUEST_NO_PICKUP', 'EIC_CREATE', 'EIC_UPDATE', 'EIC_DELETE', 'EIC_STATUS_CHANGE', 'EIC_REQUEST_APPROVE', 'EIC_REQUEST_REJECT', 'EIC_REQUEST_NO_PICKUP', 'SEMINAR_CREATE', 'SEMINAR_UPDATE', 'SEMINAR_DELETE', 'SEMINAR_STATUS_CHANGE', 'SEMINAR_PARTICIPANT_UPDATE', 'CONTENT_CREATE', 'CONTENT_UPDATE', 'CONTENT_DELETE', 'SYSTEM_BACKUP', 'SYSTEM_RESTORE', 'SYSTEM_MAINTENANCE', 'PROFILE_UPDATE', 'PROFILE_PICTURE_UPDATE', 'SETTINGS_UPDATE') NOT NULL,
    `targetType` VARCHAR(191) NULL,
    `targetId` VARCHAR(191) NULL,
    `targetName` VARCHAR(191) NULL,
    `details` TEXT NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `isGroup` BOOLEAN NOT NULL DEFAULT false,
    `roomType` ENUM('DIRECT', 'GROUP', 'SUPPORT') NOT NULL DEFAULT 'DIRECT',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `chat_rooms_isActive_idx`(`isActive`),
    INDEX `chat_rooms_lastActivity_idx`(`lastActivity`),
    INDEX `chat_rooms_roomType_idx`(`roomType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_participants` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastSeen` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unreadCount` INTEGER NOT NULL DEFAULT 0,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_participants_userId_idx`(`userId`),
    INDEX `chat_participants_roomId_idx`(`roomId`),
    UNIQUE INDEX `chat_participants_userId_roomId_key`(`userId`, `roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `messageType` ENUM('TEXT', 'IMAGE', 'FILE', 'SYSTEM') NOT NULL DEFAULT 'TEXT',
    `senderId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `isEdited` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `replyToId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `chat_messages_roomId_idx`(`roomId`),
    INDEX `chat_messages_senderId_idx`(`senderId`),
    INDEX `chat_messages_createdAt_idx`(`createdAt`),
    INDEX `chat_messages_isDeleted_idx`(`isDeleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_attachments` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `filepath` VARCHAR(191) NOT NULL,
    `filesize` INTEGER NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `uploadedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_attachments_messageId_idx`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_read_receipts` (
    `id` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `readAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_read_receipts_messageId_idx`(`messageId`),
    INDEX `chat_read_receipts_userId_idx`(`userId`),
    UNIQUE INDEX `chat_read_receipts_messageId_userId_key`(`messageId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiries` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `userId` VARCHAR(191) NOT NULL,
    `guestName` VARCHAR(191) NULL,
    `guestEmail` VARCHAR(191) NULL,
    `assignedToId` VARCHAR(191) NULL,
    `resolvedById` VARCHAR(191) NULL,
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inquiries_status_idx`(`status`),
    INDEX `inquiries_userId_idx`(`userId`),
    INDEX `inquiries_assignedToId_idx`(`assignedToId`),
    INDEX `inquiries_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_replies` (
    `id` VARCHAR(191) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `senderId` VARCHAR(191) NULL,
    `senderType` ENUM('USER', 'ADMIN', 'BOT') NOT NULL,
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
    `filepath` VARCHAR(191) NULL,
    `filesize` INTEGER NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `fileData` LONGBLOB NULL,
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
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `helpfulCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `faqs_isActive_idx`(`isActive`),
    INDEX `faqs_orderIndex_idx`(`orderIndex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_items` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `picture` LONGBLOB NULL,
    `category` ENUM('Farming_Equipment', 'Harvesting_Tools', 'Irrigation_Systems', 'Storage_Equipment', 'Processing_Equipment', 'Safety_Gear', 'Pest_Control', 'Livestock_Equipment', 'Measuring_Tools', 'Fisheries', 'Machinery', 'Other') NOT NULL DEFAULT 'Other',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inventory_items_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_stacks` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('Available', 'Unavailable', 'Damaged', 'EIC', 'Distributed') NOT NULL DEFAULT 'Available',
    `date_limit` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `itemStackId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('Pending', 'Approved', 'Rejected', 'Returned', 'No_Return', 'late_return', 'No_Pickup', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `pickupDate` DATETIME(3) NOT NULL,
    `returnDate` DATETIME(3) NULL,
    `requestNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_preferences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_preferences_userId_key_key`(`userId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `seminars` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `speaker` VARCHAR(191) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `registration_deadline` DATE NOT NULL,
    `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
    `picture` LONGBLOB NULL,
    `mimeType` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seminar_participants` (
    `id` VARCHAR(191) NOT NULL,
    `seminar_id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `status` ENUM('Attended', 'Not Attended', 'Registered', 'Cancelled') NOT NULL DEFAULT 'Registered',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `seminar_participants_seminar_id_account_id_key`(`seminar_id`, `account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey_forms` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `category` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey_fields` (
    `id` VARCHAR(191) NOT NULL,
    `surveyFormId` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'TEXTAREA', 'EMAIL', 'NUMBER', 'DATE', 'SELECT', 'RADIO', 'CHECKBOX', 'FILE') NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `placeholder` VARCHAR(191) NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `options` JSON NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey_responses` (
    `id` VARCHAR(191) NOT NULL,
    `surveyFormId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey_answers` (
    `id` VARCHAR(191) NOT NULL,
    `responseId` VARCHAR(191) NOT NULL,
    `fieldId` VARCHAR(191) NOT NULL,
    `answer` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `survey_answers_responseId_fieldId_key`(`responseId`, `fieldId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `survey_statistics` (
    `id` VARCHAR(191) NOT NULL,
    `surveyFormId` VARCHAR(191) NOT NULL,
    `chartType` ENUM('BAR', 'PIE', 'LINE', 'DOUGHNUT', 'AREA', 'COLUMN', 'SCATTER') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `config` JSON NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_participants` ADD CONSTRAINT `chat_participants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_participants` ADD CONSTRAINT `chat_participants_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_replyToId_fkey` FOREIGN KEY (`replyToId`) REFERENCES `chat_messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_attachments` ADD CONSTRAINT `chat_attachments_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_attachments` ADD CONSTRAINT `chat_attachments_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_read_receipts` ADD CONSTRAINT `chat_read_receipts_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `chat_messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_read_receipts` ADD CONSTRAINT `chat_read_receipts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `item_stacks` ADD CONSTRAINT `item_stacks_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `inventory_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_itemStackId_fkey` FOREIGN KEY (`itemStackId`) REFERENCES `item_stacks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_preferences` ADD CONSTRAINT `user_preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registered_crops` ADD CONSTRAINT `registered_crops_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crop_monthly_reports` ADD CONSTRAINT `crop_monthly_reports_cropId_fkey` FOREIGN KEY (`cropId`) REFERENCES `registered_crops`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminars` ADD CONSTRAINT `seminars_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar_participants` ADD CONSTRAINT `seminar_participants_seminar_id_fkey` FOREIGN KEY (`seminar_id`) REFERENCES `seminars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar_participants` ADD CONSTRAINT `seminar_participants_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_forms` ADD CONSTRAINT `survey_forms_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_fields` ADD CONSTRAINT `survey_fields_surveyFormId_fkey` FOREIGN KEY (`surveyFormId`) REFERENCES `survey_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_responses` ADD CONSTRAINT `survey_responses_surveyFormId_fkey` FOREIGN KEY (`surveyFormId`) REFERENCES `survey_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_responses` ADD CONSTRAINT `survey_responses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_answers` ADD CONSTRAINT `survey_answers_responseId_fkey` FOREIGN KEY (`responseId`) REFERENCES `survey_responses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_answers` ADD CONSTRAINT `survey_answers_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `survey_fields`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_statistics` ADD CONSTRAINT `survey_statistics_surveyFormId_fkey` FOREIGN KEY (`surveyFormId`) REFERENCES `survey_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `survey_statistics` ADD CONSTRAINT `survey_statistics_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
