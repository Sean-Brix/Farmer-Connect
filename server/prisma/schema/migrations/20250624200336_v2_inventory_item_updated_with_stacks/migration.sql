/*
  Warnings:

  - You are about to drop the column `status` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `inventory_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inventory_items` DROP COLUMN `status`,
    DROP COLUMN `stock`;

-- CreateTable
CREATE TABLE `item_stacks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `quantity` INTEGER NULL,
    `weight` DOUBLE NULL,
    `status` ENUM('Available', 'Unavailable', 'Lost', 'Damaged', 'Reserved', 'Borrowed', 'Distributed') NOT NULL DEFAULT 'Available',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `item_stacks` ADD CONSTRAINT `item_stacks_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `inventory_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
