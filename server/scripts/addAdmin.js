import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting admin account seed...');

  // Hash the password
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Create or update the admin account
  const admin = await prisma.account.upsert({
    where: { username: 'admin' },
    update: {
      firstName: 'System',
      surname: 'Admin',
      password: hashedPassword,
      access: 'Super_Admin',
    },
    create: {
      firstName: 'System',
      surname: 'Admin',
      username: 'admin',
      password: hashedPassword,
      access: 'Super_Admin',
      email: 'admin@farmerconnect.com',
      mobileNumber: '09000000000',
      middleName: '',
      province: 'System',
      municipality: 'System',
      barangay: 'System',
      sex: 'Other',
    },
  });

  console.log('✅ Admin account created/updated:');
  console.log('   Username:', admin.username);
  console.log('   Name:', `${admin.firstName} ${admin.surname}`);
  console.log('   Type:', admin.access);
  console.log('   Status:', admin.accountStatus);
  console.log('\n📝 Login Credentials:');
  console.log('   Username: admin');
  console.log('   Password: 123456');
  console.log('\n⚠️  Remember to change the password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });