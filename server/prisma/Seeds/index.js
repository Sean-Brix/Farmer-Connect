import { PrismaClient } from '@prisma/client';
import { seedAccounts } from './accounts.seed.js';
import { seedPlantingSeasons, seedSeedVarieties, seedPlantingReports } from './planting-reports.seed.js';
import { seedFAQCategories, seedFAQs } from './faq.seed.js';
import { seedSurveyForms, seedSurveyResponsesWithAnswers } from './surveys.seed.js';
import { seedInventoryItems, seedItemStacks, seedItemTransactions } from './inventory.seed.js';
import { seedSeminars } from './seminars.seed.js';
import { seedDistributionRequests } from './distribution.seed.js';
import { seedComprehensiveAllStates } from './comprehensive-all-states.seed.js';

const prisma = new PrismaClient();

// Check for --comprehensive flag
const useComprehensive = process.argv.includes('--comprehensive') || process.argv.includes('--all-states');

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
    // If --comprehensive flag is used, run the comprehensive all-states seed
    if (useComprehensive) {
      console.log('🚀 Running COMPREHENSIVE ALL-STATES seed...\n');
      await seedComprehensiveAllStates();
      return;
    }

    console.log('🌱 Starting comprehensive seed process...\n');

    // Clean existing data in correct order (respecting foreign keys)
    // Delete child tables first, then parent tables
    console.log('🧹 Cleaning existing data...');
    
    // Delete in batches to avoid timeout and ensure proper cleanup
    try {
      // Batch 1: Delete deeply nested dependencies first
      const deleted1 = await prisma.auditLog.deleteMany({});
      const deleted2 = await prisma.chatAttachment.deleteMany({});
      const deleted3 = await prisma.chatReadReceipt.deleteMany({});
      const deleted4 = await prisma.chatMessage.deleteMany({});
      const deleted5 = await prisma.chatParticipant.deleteMany({});
      const deleted6 = await prisma.chatRoom.deleteMany({});
      const deleted7 = await prisma.notification.deleteMany({});
      const deleted8 = await prisma.notificationSettings.deleteMany({});
      console.log(`  ✓ Deleted ${deleted1.count + deleted2.count + deleted3.count + deleted4.count + deleted5.count + deleted6.count + deleted7.count + deleted8.count} chat and notification records`);

      // Batch 2: Delete inquiry data
      const deleted9 = await prisma.inquiryAttachment.deleteMany({});
      const deleted10 = await prisma.inquiryReply.deleteMany({});
      const deleted11 = await prisma.inquiry.deleteMany({});
      console.log(`  ✓ Deleted ${deleted9.count + deleted10.count + deleted11.count} inquiry records`);

      // Batch 3: Delete survey data (answers before responses before fields/forms)
      const deleted12 = await prisma.surveyAnswer.deleteMany({});
      const deleted13 = await prisma.surveyResponse.deleteMany({});
      const deleted14 = await prisma.surveyStatistic.deleteMany({});
      const deleted15 = await prisma.surveyField.deleteMany({});
      const deleted16 = await prisma.surveyForm.deleteMany({});
      console.log(`  ✓ Deleted ${deleted12.count + deleted13.count + deleted14.count + deleted15.count + deleted16.count} survey records`);

      // Batch 4: Delete seminar data
      const deleted17 = await prisma.seminarParticipant.deleteMany({});
      const deleted18 = await prisma.seminar.deleteMany({});
      console.log(`  ✓ Deleted ${deleted17.count + deleted18.count} seminar records`);

      // Batch 5: Delete planting reports (before item transactions)
      const deleted19 = await prisma.plantingReport.deleteMany({});
      console.log(`  ✓ Deleted ${deleted19.count} planting reports`);

      // Batch 6: Delete distribution quota/waitlist data
      const deleted20 = await prisma.distributionHistory.deleteMany({});
      const deleted21 = await prisma.distributionWaitlist.deleteMany({});
      const deleted22 = await prisma.distributionQuota.deleteMany({});
      console.log(`  ✓ Deleted ${deleted20.count + deleted21.count + deleted22.count} distribution quota records`);

      // Batch 7: Delete EIC/Inventory/Distribution data (transactions → stacks → items)
      const deletedTxn = await prisma.itemTransaction.deleteMany({});
      console.log(`  ✓ Deleted ${deletedTxn.count} item transactions (EIC + Distribution)`);
      
      const deletedStacks = await prisma.itemStack.deleteMany({});
      console.log(`  ✓ Deleted ${deletedStacks.count} item stacks`);
      
      const deletedItems = await prisma.inventoryItem.deleteMany({});
      console.log(`  ✓ Deleted ${deletedItems.count} inventory items`);

      // Batch 8: Delete seed varieties and seasons
      const deleted23 = await prisma.seedVariety.deleteMany({});
      const deleted24 = await prisma.plantingSeason.deleteMany({});
      console.log(`  ✓ Deleted ${deleted23.count} seed varieties and ${deleted24.count} planting seasons`);

      // Batch 9: Delete FAQ data
      const deleted25 = await prisma.fAQ.deleteMany({});
      const deleted26 = await prisma.fAQCategory.deleteMany({});
      console.log(`  ✓ Deleted ${deleted25.count} FAQs and ${deleted26.count} FAQ categories`);

      // Batch 10: Delete user preferences and accounts (LAST)
      const deleted27 = await prisma.userPreference.deleteMany({});
      const deleted28 = await prisma.account.deleteMany({});
      console.log(`  ✓ Deleted ${deleted27.count} user preferences and ${deleted28.count} accounts`);

      console.log('✅ Database completely wiped clean\n');
      await prisma.inquiryAttachment.deleteMany({});
      await prisma.inquiryReply.deleteMany({});
      await prisma.inquiry.deleteMany({});
      console.log('  ✓ Deleted inquiry data');

      // Batch 3: Delete survey data (answers before responses)
      await prisma.surveyAnswer.deleteMany({});
      await prisma.surveyResponse.deleteMany({});
      await prisma.surveyStatistic.deleteMany({});
      await prisma.surveyField.deleteMany({});
      await prisma.surveyForm.deleteMany({});
      console.log('  ✓ Deleted survey data');

      // Batch 4: Delete seminar data
      await prisma.seminarParticipant.deleteMany({});
      await prisma.seminar.deleteMany({});
      console.log('  ✓ Deleted seminar data');

      // Batch 5: Delete EIC/Inventory data (transactions before stacks before items)
      await prisma.itemTransaction.deleteMany({});
      console.log('  ✓ Deleted item transactions');
      await prisma.itemStack.deleteMany({});
      console.log('  ✓ Deleted item stacks');
      await prisma.inventoryItem.deleteMany({});
      console.log('  ✓ Deleted inventory items');

      // Batch 6: Delete planting data
      await prisma.plantingReport.deleteMany({});
      await prisma.seedVariety.deleteMany({});
      await prisma.plantingSeason.deleteMany({});
      console.log('  ✓ Deleted planting data');

      // Batch 7: Delete FAQ data
      await prisma.fAQ.deleteMany({});
      await prisma.fAQCategory.deleteMany({});
      console.log('  ✓ Deleted FAQ data');

      // Batch 8: Delete user preferences and accounts
      await prisma.userPreference.deleteMany({});
      await prisma.account.deleteMany({});
      console.log('  ✓ Deleted accounts and preferences');

      // Batch 9: Ensure no Reserved stacks exist (cleanup from application logic)
      console.log('✅ Database completely wiped clean\n');
    } catch (error) {
      console.error('❌ Error during cleanup:', error.message);
      throw error;
    }

    // ==================== START SEEDING ====================
    // Seed in correct order
    await runStep('Accounts', () => seedAccounts(prisma));
    
    // FAQ Categories and FAQs
    await runStep('FAQ Categories', () => seedFAQCategories(prisma));
    await runStep('FAQs', () => seedFAQs(prisma));
    
    // Survey Forms and Responses
    await runStep('Survey Forms', () => seedSurveyForms(prisma));
    await runStep('Survey Responses', () => seedSurveyResponsesWithAnswers(prisma));
    
    // Inventory Items and Stacks (EIC only first)
    await runStep('Inventory Items', () => seedInventoryItems(prisma));
    await runStep('Item Stacks', () => seedItemStacks(prisma));
    
    // Seminars
    await runStep('Seminars', () => seedSeminars(prisma));
    
    // Planting Reports (with distribution integration)
    const seasons = await runStep('Planting Seasons', () => seedPlantingSeasons(prisma));
    const varieties = await runStep('Seed Varieties', () => seedSeedVarieties(prisma));
    
    // NOW create distribution inventory items and stacks (after varieties exist)
    await runStep('Distribution Items', () => seedInventoryItems(prisma));
    await runStep('Distribution Stacks', () => seedItemStacks(prisma));
    
    // Item Transactions (EIC and Distribution requests) - DISABLED
    // await runStep('Item Transactions', () => seedItemTransactions(prisma));
    
    await runStep('Planting Reports', () => seedPlantingReports(prisma, seasons, varieties));

    // Final summary - Use single batch query
    console.log('\n📊 Calculating summary...');
    const [
      accounts,
      faqCategories,
      faqs,
      surveyForms,
      surveyResponses,
      inventoryItems,
      itemStacks,
      seminars,
      distributionRequests,
      seasonCount,
      varietyCount,
      plantingReportCount
    ] = await prisma.$transaction([
      prisma.account.count(),
      prisma.fAQCategory.count(),
      prisma.fAQ.count(),
      prisma.surveyForm.count(),
      prisma.surveyResponse.count(),
      prisma.inventoryItem.count(),
      prisma.itemStack.count(),
      prisma.seminar.count(),
      prisma.itemTransaction.count({ where: { status: { in: ['Picked_Up', 'Planted'] } } }),
      prisma.plantingSeason.count(),
      prisma.seedVariety.count(),
      prisma.plantingReport.count(),
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`  Accounts:              ${accounts} (System Admin)`);
    console.log(`  FAQ Categories:        ${faqCategories}`);
    console.log(`  FAQs:                  ${faqs}`);
    console.log(`  Survey Forms:          ${surveyForms}`);
    console.log(`  Survey Responses:      ${surveyResponses}`);
    console.log(`  Inventory Items:       ${inventoryItems}`);
    console.log(`  Item Stacks:           ${itemStacks}`);
    console.log(`  Seminars:              ${seminars}`);
    console.log(`  Distribution Requests: ${distributionRequests}`);
    console.log(`  Planting Seasons:      ${seasonCount}`);
    console.log(`  Seed Varieties:        ${varietyCount}`);
    console.log(`  Planting Reports:      ${plantingReportCount}`);
    console.log('\n✨ All done! Database seeded successfully.\n');
    
    console.log('📝 Login Credentials:');
    console.log('   username: admin');
    console.log('   password: 123456');
  } finally {
    await prisma.$disconnect();
  }
}

main();
