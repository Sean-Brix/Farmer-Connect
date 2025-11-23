/*
  Warnings:

  - You are about to drop the column `address` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `barangay` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `birthCountry` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `birthMunicipality` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `birthProvince` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `civilStatus` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `disabilityType` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `farmingActivities` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `farmworkActivities` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `farmworkOthersSpecify` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `femaleHouseholdMembers` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `fishingActivities` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `fishingOthersSpecify` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `govIdNumber` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `govIdType` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `grossAnnualIncome` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `hasGovId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `houseNumber` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `householdHeadName` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `incomeSource` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `isHouseholdHead` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `isPWD` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `landlineNumber` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `livelihoodProfile` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `livestockSpecify` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `maleHouseholdMembers` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `municipality` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `otherCropsSpecify` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `otherReligionSpecify` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipToHead` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `spouseName` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `youthActivities` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `youthOthersSpecify` on the `accounts` table. All the data in the column will be lost.
  - You are about to alter the column `sex` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(17))` to `Enum(EnumId(0))`.

*/
-- DropIndex
DROP INDEX `accounts_email_key` ON `accounts`;

-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `address`,
    DROP COLUMN `barangay`,
    DROP COLUMN `birthCountry`,
    DROP COLUMN `birthMunicipality`,
    DROP COLUMN `birthProvince`,
    DROP COLUMN `civilStatus`,
    DROP COLUMN `disabilityType`,
    DROP COLUMN `education`,
    DROP COLUMN `farmingActivities`,
    DROP COLUMN `farmworkActivities`,
    DROP COLUMN `farmworkOthersSpecify`,
    DROP COLUMN `femaleHouseholdMembers`,
    DROP COLUMN `fishingActivities`,
    DROP COLUMN `fishingOthersSpecify`,
    DROP COLUMN `govIdNumber`,
    DROP COLUMN `govIdType`,
    DROP COLUMN `grossAnnualIncome`,
    DROP COLUMN `hasGovId`,
    DROP COLUMN `houseNumber`,
    DROP COLUMN `householdHeadName`,
    DROP COLUMN `incomeSource`,
    DROP COLUMN `isHouseholdHead`,
    DROP COLUMN `isPWD`,
    DROP COLUMN `landlineNumber`,
    DROP COLUMN `livelihoodProfile`,
    DROP COLUMN `livestockSpecify`,
    DROP COLUMN `maleHouseholdMembers`,
    DROP COLUMN `mimeType`,
    DROP COLUMN `mobileNumber`,
    DROP COLUMN `municipality`,
    DROP COLUMN `otherCropsSpecify`,
    DROP COLUMN `otherReligionSpecify`,
    DROP COLUMN `picture`,
    DROP COLUMN `province`,
    DROP COLUMN `region`,
    DROP COLUMN `relationshipToHead`,
    DROP COLUMN `religion`,
    DROP COLUMN `spouseName`,
    DROP COLUMN `street`,
    DROP COLUMN `youthActivities`,
    DROP COLUMN `youthOthersSpecify`,
    ADD COLUMN `contactNumber` VARCHAR(191) NULL,
    ADD COLUMN `picturePath` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `sex` ENUM('Male', 'Female') NOT NULL DEFAULT 'Male';
