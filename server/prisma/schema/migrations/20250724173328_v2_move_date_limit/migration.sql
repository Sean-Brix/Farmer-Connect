/*
  Warnings:

  - You are about to drop the column `dateLimit` on the `item_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `item_stacks` ADD COLUMN `date_limit` INTEGER NULL;

-- AlterTable
ALTER TABLE `item_transactions` DROP COLUMN `dateLimit`;
