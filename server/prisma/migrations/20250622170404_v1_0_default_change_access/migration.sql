-- AlterTable
ALTER TABLE `accounts` MODIFY `access` ENUM('User', 'Admin', 'Super Admin', '') NOT NULL DEFAULT 'User';
