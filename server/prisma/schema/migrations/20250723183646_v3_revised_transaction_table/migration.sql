/*
  Warnings:

  - You are about to drop the column `transactionType` on the `item_transactions` table. All the data in the column will be lost.
  - Added the required column `pickupDate` to the `item_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item_transactions` DROP COLUMN `transactionType`,
    ADD COLUMN `dateLimit` INTEGER NULL,
    ADD COLUMN `pickupDate` DATETIME(3) NOT NULL,
    ADD COLUMN `returnDate` DATETIME(3) NULL,
    MODIFY `status` ENUM('Pending', 'Approved', 'Rejected', 'Returned', 'No_Return', 'late_return', 'No_Pickup', 'Cancelled') NOT NULL DEFAULT 'Pending';
