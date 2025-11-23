/*
  Warnings:

  - You are about to drop the column `dateOfHarvest` on the `planting_reports` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `planting_reports_dateOfHarvest_idx` ON `planting_reports`;

-- AlterTable
ALTER TABLE `planting_reports` DROP COLUMN `dateOfHarvest`;
