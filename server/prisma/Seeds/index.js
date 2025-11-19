import { PrismaClient } from '@prisma/client';
import { seedAccounts } from './accounts.seed.js';
import { seedUserPreferences, seedRegisteredCrops } from './preferences-and-crops.seed.js';
import seedCropGuidelines from './seedCropGuidelines.js';
import { seedCropReports } from './crop-reports.seed.js';

const prisma = new PrismaClient();

function makeSpinner(label) {
  const frames = ['-', '\\', '|', '/'];
  let i = 0;
  let timer = null;
  const start = Date.now();
  const prefix = `[${label}]`;
  function tick() {
    const f = frames[i = (i + 1) % frames.length];
    const elapsed = ((Date.now() - start) / 1000).toFixed(1).padStart(5, ' ');
    process.stdout.write(`\r${prefix} ${f} running... ${elapsed}s`);
  }
  return {
    start() {
      process.stdout.write(`\n`);
      timer = setInterval(tick, 100);
    },
    stop(success = true) {
      if (timer) clearInterval(timer);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const status = success ? 'DONE' : 'FAIL';
      process.stdout.write(`\r${prefix} ${status} in ${elapsed}s\n`);
    }
  };
}

async function runStep(label, fn) {
  const spin = makeSpinner(label);
  spin.start();
  try {
    const result = await fn();
    spin.stop(true);
    return result;
  } catch (e) {
    spin.stop(false);
    throw e;
  }
}

async function main() {
  try {
    console.log('🌱 Starting simplified seed process...\n');

    // Clean existing data in correct order
    console.log('🧹 Cleaning existing data...');
    await prisma.reportFeedback.deleteMany({});
    await prisma.stageReport.deleteMany({});
    await prisma.registeredCrop.deleteMany({});
    await prisma.cropGuidelineStage.deleteMany({});
    await prisma.cropGuideline.deleteMany({});
    await prisma.userPreference.deleteMany({});
    await prisma.account.deleteMany({});
    console.log('✅ Cleanup complete\n');

    // Seed in correct order
    await runStep('Accounts', () => seedAccounts(prisma));
    await runStep('CropGuidelines', () => seedCropGuidelines(prisma));
    await runStep('RegisteredCrops', () => seedRegisteredCrops(prisma));
    await runStep('CropReports', () => seedCropReports(prisma));
    await runStep('UserPreferences', () => seedUserPreferences(prisma));

    // Final summary
    const [accounts, guidelines, crops, reports, feedback] = await Promise.all([
      prisma.account.count(),
      prisma.cropGuideline.count(),
      prisma.registeredCrop.count(),
      prisma.stageReport.count(),
      prisma.reportFeedback.count(),
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`  Accounts:        ${accounts} (1 Super_Admin, ${accounts - 1} Users)`);
    console.log(`  Crop Guidelines: ${guidelines}`);
    console.log(`  Registered Crops: ${crops}`);
    console.log(`  Crop Reports:    ${reports}`);
    console.log(`  Feedback:        ${feedback}`);
    console.log('\n✨ All done! Database seeded successfully.\n');
    
    console.log('📝 Login Credentials:');
    console.log('   Admin: username = admin, password = 123456');
    console.log('   Users: username = [firstname].[surname] (e.g., juan.delacruz), password = 123456');
    console.log('\n💡 6 users have crop reports with feedback, 3 users have crops without reports');
  } finally {
    await prisma.$disconnect();
  }
}

main();
