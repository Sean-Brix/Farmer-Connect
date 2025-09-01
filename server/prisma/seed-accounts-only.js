import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import path from 'path';
import sharp from 'sharp';

// Load account data
import users from './Data/account.json' with { type: 'json' };

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const safeWait = (ms) => new Promise((res) => setTimeout(res, ms));

async function seedAccountsOnly() {
  console.log('Seeding accounts only…');
  const defaultPassword = '123456';

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // Skip if username already exists
    const existing = await prisma.account.findUnique({ where: { username: user.username } });
    if (existing) {
      console.log(`User ${user.username} already exists, skipping…`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Optional: attach sample image for the first few users if available
    let picture = null;
    let mimeType = null;
    try {
      if (i < 13) {
        const idx = i + 1;
        let imageName = `sample${idx}`;
        if (idx === 2) { imageName += '.jpeg'; mimeType = 'image/jpeg'; }
        else if (idx === 3) { imageName += '.png'; mimeType = 'image/png'; }
        else { imageName += '.jpg'; mimeType = 'image/jpeg'; }

        // Prefer the actual folder name in repo: Data/Images/Accounts
        const imagePath = path.join(__dirname, 'Data', 'Images', 'Accounts', imageName);
        picture = await sharp(imagePath).resize(300).jpeg({ quality: 80 }).toBuffer();
      }
    } catch (e) {
      // If image files are not available, continue without images
      picture = null; mimeType = null;
    }

    try {
      await prisma.account.create({
        data: {
          username: user.username,
          email: user.email,
          password: hashedPassword,
          access: user.access,

          // Personal Information
          firstName: user.firstName,
          middleName: user.middleName,
          surname: user.surname,
          extensionName: user.extensionName,
          sex: user.sex,

          // Address Information
          street: user.street,
          barangay: user.barangay,
          municipality: user.municipality,
          province: user.province,
          region: user.region,
          houseNumber: user.houseNumber,

          // Contact Information
          mobileNumber: user.mobileNumber,
          landlineNumber: user.landlineNumber,

          // Birth Information
          birthMunicipality: user.birthMunicipality,
          birthProvince: user.birthProvince,
          birthCountry: user.birthCountry,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,

          // Personal Details
          religion: user.religion,
          otherReligionSpecify: user.otherReligionSpecify,
          civilStatus: user.civilStatus,
          spouseName: user.spouseName,

          // Household Information
          femaleHouseholdMembers: user.femaleHouseholdMembers,
          maleHouseholdMembers: user.maleHouseholdMembers,
          isHouseholdHead: user.isHouseholdHead === 'Yes',
          householdHeadName: user.householdHeadName,
          relationshipToHead: user.relationshipToHead,

          // Government ID Information
          hasGovId: user.hasGovId === 'Yes',
          govIdType: user.govIdType,
          govIdNumber: user.govIdNumber,

          // Education
          education: user.education,

          // Livelihood Profile (as JSON)
          livelihoodProfile: user.livelihoodProfile,
          farmingActivities: user.farmingActivities,
          fishingActivities: user.fishingActivities,
          farmworkActivities: user.farmworkActivities,
          youthActivities: user.youthActivities,

          // Livelihood Specifications
          otherCropsSpecify: user.otherCropsSpecify,
          livestockSpecify: user.livestockSpecify,
          fishingOthersSpecify: user.fishingOthersSpecify,
          farmworkOthersSpecify: user.farmworkOthersSpecify,
          youthOthersSpecify: user.youthOthersSpecify,

          // Income Information
          grossAnnualIncome: user.grossAnnualIncome,
          incomeSource: user.incomeSource,

          // Profile Photo
          picture,
          mimeType,

          // Legacy fields (for compatibility)
          client_profile: user.client_profile,
          address: user.address,
        }
      });

      await safeWait(50);
    } catch (e) {
      console.error(`Failed to create user ${user.username}:`, e?.message || e);
    }
  }

  console.log('Accounts seeding finished.');
}

async function main() {
  try {
    await seedAccountsOnly();
  } finally {
    await prisma.$disconnect();
  }
}

main();
