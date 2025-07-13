/*
  Warnings:

  - You are about to drop the column `categoryId` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the `inventory_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventory_items` DROP FOREIGN KEY `inventory_items_categoryId_fkey`;

-- DropIndex
DROP INDEX `inventory_items_categoryId_fkey` ON `inventory_items`;

-- AlterTable
ALTER TABLE `inventory_items` DROP COLUMN `categoryId`,
    ADD COLUMN `category` ENUM('Farming_Equipment', 'Harvesting_Tools', 'Irrigation_Systems', 'Storage_Equipment', 'Processing_Equipment', 'Safety_Gear', 'Pest_Control', 'Livestock_Equipment', 'Measuring_Tools', 'Fisheries', 'Machinery', 'Other') NOT NULL DEFAULT 'Other';

-- DropTable
DROP TABLE `inventory_categories`;
