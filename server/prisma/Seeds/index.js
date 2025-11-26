import { PrismaClient } from '@prisma/client';
import { seedAccounts } from './accounts.seed.js';
import { seedPlantingSeasons, seedSeedVarieties, seedPlantingReports } from './planting-reports.seed.js';
import { seedFAQCategories, seedFAQs } from './faq.seed.js';
import { seedSurveyForms } from './surveys.seed.js';
import { seedInventoryItems, seedItemStacks } from './inventory.seed.js';
import { seedSeminars } from './seminars.seed.js';

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
    console.log('🌱 Starting comprehensive seed process...\n');

    // Clean existing data in correct order (respecting foreign keys)
    // Delete child tables first, then parent tables
    console.log('🧹 Cleaning existing data in batch...');
    
    // Use $transaction to batch all cleanup operations
    await prisma.$transaction([
      // Delete data that references Account (children first)
      prisma.auditLog.deleteMany({}),
      prisma.chatAttachment.deleteMany({}),
      prisma.chatReadReceipt.deleteMany({}),
      prisma.chatMessage.deleteMany({}),
      prisma.chatParticipant.deleteMany({}),
      prisma.chatRoom.deleteMany({}),
      prisma.inquiryAttachment.deleteMany({}),
      prisma.inquiryReply.deleteMany({}),
      prisma.inquiry.deleteMany({}),
      prisma.surveyResponse.deleteMany({}),
      prisma.surveyStatistic.deleteMany({}),
      prisma.seminarParticipant.deleteMany({}),
      prisma.seminar.deleteMany({}),
      prisma.itemTransaction.deleteMany({}),
      prisma.itemStack.deleteMany({}),
      prisma.inventoryItem.deleteMany({}),
      prisma.userPreference.deleteMany({}),
      
      // Delete standalone data
      prisma.fAQ.deleteMany({}),
      prisma.fAQCategory.deleteMany({}),
      prisma.surveyField.deleteMany({}),
      prisma.surveyForm.deleteMany({}),
      prisma.plantingReport.deleteMany({}),
      prisma.seedVariety.deleteMany({}),
      prisma.plantingSeason.deleteMany({}),
      
      // Finally delete Account (parent)
      prisma.account.deleteMany({}),
    ], {
      timeout: 30000, // 30 seconds timeout for free tier
    });
    
    console.log('✅ Cleanup complete\n');

    // Seed in correct order
    await runStep('Accounts', () => seedAccounts(prisma));
    
    // FAQ Categories and FAQs
    await runStep('FAQ Categories', () => seedFAQCategories(prisma));
    await runStep('FAQs', () => seedFAQs(prisma));
    
    // Survey Forms
    await runStep('Survey Forms', () => seedSurveyForms(prisma));
    
    // Inventory Items and Stacks
    await runStep('Inventory Items', () => seedInventoryItems(prisma));
    await runStep('Item Stacks', () => seedItemStacks(prisma));
    
    // Seminars
    await runStep('Seminars', () => seedSeminars(prisma));
    
    // Planting Reports (original)
    const seasons = await runStep('Planting Seasons', () => seedPlantingSeasons(prisma));
    const varieties = await runStep('Seed Varieties', () => seedSeedVarieties(prisma));
    await runStep('Planting Reports', () => seedPlantingReports(prisma, seasons, varieties));

    // Final summary - Use single batch query
    console.log('\n📊 Calculating summary...');
    const [
      accounts,
      faqCategories,
      faqs,
      surveyForms,
      inventoryItems,
      itemStacks,
      seminars,
      seasonCount,
      varietyCount,
      plantingReportCount
    ] = await prisma.$transaction([
      prisma.account.count(),
      prisma.fAQCategory.count(),
      prisma.fAQ.count(),
      prisma.surveyForm.count(),
      prisma.inventoryItem.count(),
      prisma.itemStack.count(),
      prisma.seminar.count(),
      prisma.plantingSeason.count(),
      prisma.seedVariety.count(),
      prisma.plantingReport.count(),
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`  Accounts:         ${accounts} (System Admin)`);
    console.log(`  FAQ Categories:   ${faqCategories}`);
    console.log(`  FAQs:             ${faqs}`);
    console.log(`  Survey Forms:     ${surveyForms}`);
    console.log(`  Inventory Items:  ${inventoryItems}`);
    console.log(`  Item Stacks:      ${itemStacks}`);
    console.log(`  Seminars:         ${seminars}`);
    console.log(`  Planting Seasons: ${seasonCount}`);
    console.log(`  Seed Varieties:   ${varietyCount}`);
    console.log(`  Planting Reports: ${plantingReportCount}`);
    console.log('\n✨ All done! Database seeded successfully.\n');
    
    console.log('📝 Login Credentials:');
    console.log('   username: admin');
    console.log('   password: 123456');
  } finally {
    await prisma.$disconnect();
  }
}

main();
