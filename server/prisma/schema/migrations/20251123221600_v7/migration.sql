/*
  Warnings:

  - You are about to drop the column `DAS` on the `seed_varieties` table. All the data in the column will be lost.
  - Added the required column `directSeededDAS` to the `seed_varieties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transplantedDAS` to the `seed_varieties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seed_varieties` DROP COLUMN `DAS`,
    ADD COLUMN `directSeededDAS` INTEGER NOT NULL,
    ADD COLUMN `transplantedDAS` INTEGER NOT NULL;
