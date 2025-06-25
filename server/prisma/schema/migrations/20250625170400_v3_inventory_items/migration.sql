/*
  Warnings:

  - The primary key for the `inventory_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `item_stacks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `weight` on the `item_stacks` table. All the data in the column will be lost.
  - Made the column `quantity` on table `item_stacks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `item_stacks` DROP FOREIGN KEY `item_stacks_itemId_fkey`;

-- DropIndex
DROP INDEX `item_stacks_itemId_fkey` ON `item_stacks`;

-- AlterTable
ALTER TABLE `inventory_items` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `item_stacks` DROP PRIMARY KEY,
    DROP COLUMN `weight`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `itemId` VARCHAR(191) NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 1,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `item_stacks` ADD CONSTRAINT `item_stacks_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `inventory_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
