import { PrismaClient } from '@prisma/client';
import { seedAccounts } from './accounts.seed.js';
import { seedSeminars, seedSeminarParticipants } from './seminars.seed.js';
import { seedInventoryItems, seedItemStacks, seedItemTransactions } from './inventory.seed.js';
import { seedFAQCategories, seedFAQs, seedInquiries } from './inquiries.seed.js';
import { seedSurveyForms, seedSurveyResponses, seedSurveyStatistics } from './surveys.seed.js';
import { seedChat } from './chat.seed.js';
import { seedAuditLogs } from './audit.seed.js';
import { seedDataAccounts, seedDataInventoryItems, seedDataSeminars, seedDataFAQsAndInquiries } from './data-import.seed.js';
import { seedAccountImages, seedSeminarImages } from './images.seed.js';
import { seedUserPreferences, seedRegisteredCrops } from './preferences-and-crops.seed.js';
import seedCropGuidelines from './seedCropGuidelines.js';

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
    console.log('Seeding started...');

  await runStep('DataAccounts', () => seedDataAccounts(prisma));
  await runStep('Accounts', () => seedAccounts(prisma, { count: 220 }));
    await runStep('Seminars', () => seedSeminars(prisma, { count: 160 }));
    await runStep('SeminarParticipants', () => seedSeminarParticipants(prisma));

  await runStep('DataInventoryItems', () => seedDataInventoryItems(prisma));
  await runStep('InventoryItems', () => seedInventoryItems(prisma, { count: 90 }));
    await runStep('ItemStacks', () => seedItemStacks(prisma));
    await runStep('ItemTransactions', () => seedItemTransactions(prisma, { perStackMax: 7 }));

  await runStep('DataSeminars', () => seedDataSeminars(prisma));
  await runStep('AccountImages', () => seedAccountImages(prisma));
  await runStep('SeminarImages', () => seedSeminarImages(prisma));
  await runStep('FAQCategories', () => seedFAQCategories(prisma));
  await runStep('FAQs', () => seedFAQs(prisma, { count: 40 }));
  await runStep('DataFAQs&Inquiries', () => seedDataFAQsAndInquiries(prisma));
  await runStep('Inquiries', () => seedInquiries(prisma, { count: 200 }));

    await runStep('SurveyForms', () => seedSurveyForms(prisma));
    await runStep('SurveyResponses', () => seedSurveyResponses(prisma));
    await runStep('SurveyStatistics', () => seedSurveyStatistics(prisma));

  await runStep('Chat', () => seedChat(prisma, { rooms: 40, maxParticipants: 7, maxMessages: 80 }));
    await runStep('AuditLogs', () => seedAuditLogs(prisma, { count: 600 }));

  await runStep('CropGuidelines', () => seedCropGuidelines());
  await runStep('UserPreferences', () => seedUserPreferences(prisma, { perUser: 3 }));
  await runStep('RegisteredCrops', () => seedRegisteredCrops(prisma, { perUserMax: 3 }));

    // Fix existing FAQs without categories - assign them to "General"
    const generalCat = await prisma.fAQCategory.findFirst({ where: { name: 'General' } });
    if (generalCat) {
      await prisma.fAQ.updateMany({
        where: { categoryId: null },
        data: { categoryId: generalCat.id },
      });
    }

    // Final summary
    const [accounts, seminars, stacks, items, txs, inquiries, faqs] = await Promise.all([
      prisma.account.count(),
      prisma.seminar.count(),
      prisma.itemStack.count(),
      prisma.inventoryItem.count(),
      prisma.itemTransaction.count(),
      prisma.inquiry.count(),
      prisma.fAQ.count(),
    ]);
    console.log('\nSeeding Summary:');
    console.log(`  Accounts:       ${accounts}`);
    console.log(`  Seminars:       ${seminars}`);
    console.log(`  InventoryItems: ${items}`);
    console.log(`  ItemStacks:     ${stacks}`);
    console.log(`  Transactions:   ${txs}`);
    console.log(`  Inquiries:      ${inquiries}`);
    console.log(`  FAQs:           ${faqs}`);
    console.log('\nAll done.');
  } finally {
    await prisma.$disconnect();
  }
}

main();
