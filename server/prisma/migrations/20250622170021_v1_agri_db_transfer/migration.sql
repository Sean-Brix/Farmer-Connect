-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `access` ENUM('User', 'Admin', 'Super Admin') NOT NULL DEFAULT 'User',
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `profile_picture` LONGBLOB NULL,
    `client_profile` ENUM('Fishfolk', 'Rural Based Org', 'Student', 'Agricultural/Fisheries Technician', 'Youth', 'Women', 'Govt Employee', 'PWD', 'Indigenous People') NOT NULL,
    `address` VARCHAR(255) NULL,
    `telephone_no` VARCHAR(20) NULL,
    `cellphone_no` VARCHAR(20) NULL,
    `occupation` VARCHAR(100) NULL,
    `position` VARCHAR(100) NULL,
    `institution` VARCHAR(150) NULL,
    `email_address` VARCHAR(150) NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distribution_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Available', 'Out of Stock', 'Discontinued') NOT NULL DEFAULT 'Available',
    `category` ENUM('Seeds', 'Fertilizers', 'Livestock', 'Fish Fingerlings', 'Organic Inputs', 'Tools', 'Plants', 'Compost', 'Other') NOT NULL,
    `added_by` INTEGER NOT NULL,
    `photo` LONGBLOB NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `added_by`(`added_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distribution_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `distribution_item_id` INTEGER NOT NULL,
    `admin_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Waiting', 'Approved', 'Rejected', 'Processing', 'Claimed') NOT NULL DEFAULT 'Waiting',
    `request_note` TEXT NULL,
    `schedule_date` DATE NULL,
    `approval_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `account_id`(`account_id`),
    INDEX `admin_id`(`admin_id`),
    INDEX `distribution_item_id`(`distribution_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Available', 'Not Available', 'Borrowed') NOT NULL,
    `category` ENUM('Farming Equipment', 'Harvesting Tools', 'Irrigation Systems', 'Storage Equipment', 'Processing Equipment', 'Safety Gear', 'Pest Control', 'Livestock Equipment', 'Measuring Tools', 'Fisheries', 'Machinery', 'Other') NOT NULL,
    `added_by` INTEGER NOT NULL,
    `photo` LONGBLOB NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_eic_added_by`(`added_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eic_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `eic_id` INTEGER NOT NULL,
    `admin_id` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('Waiting', 'Approved', 'Rejected', 'Processing', 'Returned') NOT NULL DEFAULT 'Waiting',
    `request_note` TEXT NULL,
    `borrow_date` DATE NULL,
    `return_date` DATE NULL,
    `approval_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `account_id`(`account_id`),
    INDEX `admin_id`(`admin_id`),
    INDEX `eic_id`(`eic_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `category` ENUM('Farming Equipment', 'Harvesting Tools', 'Irrigation Systems', 'Storage Equipment', 'Processing Equipment', 'Safety Gear', 'Pest Control', 'Livestock Equipment', 'Measuring Tools', 'Fisheries', 'Machinery', 'Other') NOT NULL,
    `status` ENUM('Available', 'Damaged', 'Out of Stock', 'Maintenance') NULL DEFAULT 'Available',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seminar_participants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `seminar_id` INTEGER NOT NULL,
    `status` ENUM('Registered', 'Attended', 'Cancelled', 'No Show') NOT NULL,
    `registration_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `account_id`(`account_id`),
    INDEX `seminar_id`(`seminar_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seminars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `location` VARCHAR(255) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `capacity` INTEGER NULL,
    `photo` LONGBLOB NOT NULL,
    `status` ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') NOT NULL,
    `speaker` VARCHAR(255) NULL,
    `registration_deadline` DATE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `distribution_items` ADD CONSTRAINT `distribution_items_ibfk_1` FOREIGN KEY (`added_by`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distribution_request` ADD CONSTRAINT `distribution_request_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distribution_request` ADD CONSTRAINT `distribution_request_ibfk_2` FOREIGN KEY (`distribution_item_id`) REFERENCES `distribution_items`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `distribution_request` ADD CONSTRAINT `distribution_request_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `eic` ADD CONSTRAINT `fk_eic_added_by` FOREIGN KEY (`added_by`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `eic_request` ADD CONSTRAINT `eic_request_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `eic_request` ADD CONSTRAINT `eic_request_ibfk_2` FOREIGN KEY (`eic_id`) REFERENCES `eic`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `eic_request` ADD CONSTRAINT `eic_request_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `seminar_participants` ADD CONSTRAINT `seminar_participants_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `seminar_participants` ADD CONSTRAINT `seminar_participants_ibfk_2` FOREIGN KEY (`seminar_id`) REFERENCES `seminars`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
