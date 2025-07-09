-- AlterTable
ALTER TABLE `seminars` MODIFY `start_date` DATE NOT NULL,
    MODIFY `end_date` DATE NOT NULL,
    MODIFY `start_time` VARCHAR(191) NOT NULL,
    MODIFY `end_time` VARCHAR(191) NOT NULL,
    MODIFY `registration_deadline` DATE NOT NULL;
