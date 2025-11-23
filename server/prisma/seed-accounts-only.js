import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

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

    // Set picturePath for Firebase Cloud Storage reference
    // Format: accounts/{username}.jpg (will be uploaded to Firebase separately)
    let picturePath = null;
    try {
      const imageName = `${user.username.toLowerCase()}.jpg`;
      const imagePath = path.join(__dirname, 'Data', 'Images', 'Accounts', imageName);
      // Check if file exists
      await fs.access(imagePath);
      // Store the relative path for future Firebase upload
      picturePath = `accounts/${imageName}`;
      console.log(`Profile picture path set for ${user.username}: ${picturePath}`);
    } catch (e) {
      // If image file is not available, leave picturePath as null
      console.log(`No image found for ${user.username}, picturePath will be null`);
      picturePath = null;
    }

    try {
      await prisma.account.create({
        data: {
          // Credentials
          username: user.username,
          password: hashedPassword,
          access: user.access,
          email: user.email || null,

          // Personal Information
          firstName: user.firstName,
          middleName: user.middleName || null,
          surname: user.surname,
          extensionName: user.extensionName || null,
          sex: user.sex || 'Male',
          contactNumber: user.contactNumber || null,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,

          // Profile Picture (Firebase path)
          picturePath,

          // Profile Type
          client_profile: user.client_profile || 'Other',
        }
      });

      console.log(`✓ Created account: ${user.username}`);
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
