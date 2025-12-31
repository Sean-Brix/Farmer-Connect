/*
  Warnings:

  - The values [Certified,Good,Registered,Foundation,Breeder] on the enum `planting_reports_seedClassification` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `planting_reports` MODIFY `seedClassification` ENUM('Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers') NOT NULL;
