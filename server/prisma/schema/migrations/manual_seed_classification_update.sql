-- Manual migration to update SeedClassification enum
-- This updates the enum values to match the frontend constants

-- Update existing data if any exists (map old values to new ones)
UPDATE `planting_reports`
SET `seedClassification` = 'Certified'
WHERE `seedClassification` = 'Inbred_Certified';

UPDATE `planting_reports`
SET `seedClassification` = 'Good'
WHERE `seedClassification` IN ('Inbred_Good', 'Hybrid_F1');

UPDATE `planting_reports`
SET `seedClassification` = 'Registered'
WHERE `seedClassification` = 'Inbred_Farmers';

-- Alter the enum to have the new values
ALTER TABLE `planting_reports` 
MODIFY COLUMN `seedClassification` ENUM('Certified', 'Good', 'Registered', 'Foundation', 'Breeder') NOT NULL;
