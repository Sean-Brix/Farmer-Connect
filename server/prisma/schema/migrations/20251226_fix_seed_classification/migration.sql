-- Step 1: Add new enum values while keeping old ones
ALTER TABLE `planting_reports` MODIFY `seedClassification` ENUM('Inbred_Certified', 'Hybrid_F1', 'Inbred_Good', 'Inbred_Farmers', 'Certified', 'Good', 'Registered', 'Foundation', 'Breeder') NOT NULL;

-- Step 2: Migrate existing data to new values
UPDATE `planting_reports` SET `seedClassification` = 'Certified' WHERE `seedClassification` = 'Inbred_Certified';
UPDATE `planting_reports` SET `seedClassification` = 'Good' WHERE `seedClassification` IN ('Inbred_Good', 'Hybrid_F1', 'Inbred_Farmers');

-- Step 3: Remove old enum values, keeping only new ones
ALTER TABLE `planting_reports` MODIFY `seedClassification` ENUM('Certified', 'Good', 'Registered', 'Foundation', 'Breeder') NOT NULL;
