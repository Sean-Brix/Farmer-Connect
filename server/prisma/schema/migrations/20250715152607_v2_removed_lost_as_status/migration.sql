/*
  Warnings:

  - The values [Lost] on the enum `item_stacks_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `item_stacks` MODIFY `status` ENUM('Available', 'Unavailable', 'Damaged', 'EIC', 'Distributed') NOT NULL DEFAULT 'Available';
