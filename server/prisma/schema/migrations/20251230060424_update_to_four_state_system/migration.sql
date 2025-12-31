/*
  Warnings:

  - You are about to alter the column `state` on the `planting_reports` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(24))` to `Enum(EnumId(18))`.

*/
-- AlterTable
ALTER TABLE `planting_reports` MODIFY `state` ENUM('Distributed', 'Planting', 'Planted', 'Harvested') NOT NULL DEFAULT 'Planting';
