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

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_stacks` ADD CONSTRAINT `item_stacks_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `inventory_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_itemStackId_fkey` FOREIGN KEY (`itemStackId`) REFERENCES `item_stacks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_transactions` ADD CONSTRAINT `item_transactions_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminars` ADD CONSTRAINT `seminars_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar_participants` ADD CONSTRAINT `seminar_participants_seminar_id_fkey` FOREIGN KEY (`seminar_id`) REFERENCES `seminars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar_participants` ADD CONSTRAINT `seminar_participants_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
