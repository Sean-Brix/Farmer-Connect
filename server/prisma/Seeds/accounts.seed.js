import bcrypt from 'bcrypt';

/**
 * Seed Accounts - System Admin Only
 * Creates only the Super Admin account for system management
 */
export async function seedAccounts(prisma) {
  const password = await bcrypt.hash('123456', 10);
  
  const accounts = [
    {
      username: 'admin',
      email: 'admin@farmerconnect.com',
      firstName: 'System',
      middleName: null,
      surname: 'Administrator',
      extensionName: null,
      access: 'Super_Admin',
      sex: 'Male',
      contactNumber: '09171234567',
      dateOfBirth: new Date('1985-01-15'),
      picturePath: null,
      client_profile: 'Govt_Employee',
    },
  ];

  for (const accountData of accounts) {
    await prisma.account.upsert({
      where: { username: accountData.username },
      update: {},
      create: {
        ...accountData,
        password,
      },
    });
  }

  console.log(`✅ Created ${accounts.length} account (System Administrator)`);
  console.log('📝 Login: username = admin | password = 123456');
}
