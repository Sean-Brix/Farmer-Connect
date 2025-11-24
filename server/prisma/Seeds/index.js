import { PrismaClient } from '@prisma/client';
import { seedAccounts } from './accounts.seed.js';
import { seedPlantingSeasons, seedSeedVarieties, seedPlantingReports } from './planting-reports.seed.js';

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
    await prisma.plantingReport.deleteMany({});
    await prisma.seedVariety.deleteMany({});
    await prisma.plantingSeason.deleteMany({});
    await prisma.account.deleteMany({});
    console.log('✅ Cleanup complete\n');

    // Seed in correct order
    await runStep('Accounts', () => seedAccounts(prisma));
    
    // Seed planting reports
    const seasons = await runStep('PlantingSeasons', () => seedPlantingSeasons(prisma));
    const varieties = await runStep('SeedVarieties', () => seedSeedVarieties(prisma));
    await runStep('PlantingReports', () => seedPlantingReports(prisma, seasons, varieties));

    // Final summary
    const [accounts, seasonCount, varietyCount, plantingReportCount] = await Promise.all([
      prisma.account.count(),
      prisma.plantingSeason.count(),
      prisma.seedVariety.count(),
      prisma.plantingReport.count(),
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`  Accounts:         ${accounts} (1 Super_Admin, ${accounts - 1} Users)`);
    console.log(`  Planting Seasons: ${seasonCount}`);
    console.log(`  Seed Varieties:   ${varietyCount}`);
    console.log(`  Planting Reports: ${plantingReportCount}`);
    console.log('\n✨ All done! Database seeded successfully.\n');
    
    console.log('📝 Login Credentials:');
    console.log('   Admin: username = admin, password = 123456');
    console.log('   Users: username = [firstname].[surname] (e.g., juan.delacruz), password = 123456');
  } finally {
    await prisma.$disconnect();
  }
}

main();
