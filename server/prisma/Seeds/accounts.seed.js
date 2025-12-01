import bcrypt from 'bcrypt';

/**
 * Seed Accounts - System Admin and Test Users
 * Creates admin account and multiple test user accounts for testing
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
    // Test Users
    {
      username: 'juan.cruz',
      email: 'juan.cruz@test.com',
      firstName: 'Juan',
      middleName: 'Dela',
      surname: 'Cruz',
      extensionName: null,
      access: 'User',
      sex: 'Male',
      contactNumber: '09181234567',
      dateOfBirth: new Date('1990-03-20'),
      picturePath: null,
      client_profile: 'Other',
    },
    {
      username: 'maria.santos',
      email: 'maria.santos@test.com',
      firstName: 'Maria',
      middleName: 'Luna',
      surname: 'Santos',
      extensionName: null,
      access: 'User',
      sex: 'Female',
      contactNumber: '09191234567',
      dateOfBirth: new Date('1988-07-15'),
      picturePath: null,
      client_profile: 'Women',
    },
    {
      username: 'pedro.garcia',
      email: 'pedro.garcia@test.com',
      firstName: 'Pedro',
      middleName: 'Reyes',
      surname: 'Garcia',
      extensionName: 'Jr.',
      access: 'User',
      sex: 'Male',
      contactNumber: '09201234567',
      dateOfBirth: new Date('1992-11-05'),
      picturePath: null,
      client_profile: 'Youth',
    },
    {
      username: 'ana.reyes',
      email: 'ana.reyes@test.com',
      firstName: 'Ana',
      middleName: 'Cruz',
      surname: 'Reyes',
      extensionName: null,
      access: 'User',
      sex: 'Female',
      contactNumber: '09211234567',
      dateOfBirth: new Date('1995-02-28'),
      picturePath: null,
      client_profile: 'Student',
    },
    {
      username: 'jose.fernandez',
      email: 'jose.fernandez@test.com',
      firstName: 'Jose',
      middleName: 'Antonio',
      surname: 'Fernandez',
      extensionName: 'Sr.',
      access: 'User',
      sex: 'Male',
      contactNumber: '09221234567',
      dateOfBirth: new Date('1987-09-12'),
      picturePath: null,
      client_profile: 'Fishfolk',
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

  console.log(`✅ Created ${accounts.length} accounts (1 Admin, ${accounts.length - 1} Users)`);
  console.log('📝 Login: username = admin | password = 123456');
  console.log('📝 Test users: juan.cruz, maria.santos, pedro.garcia, ana.reyes, jose.fernandez | password = 123456');
}
