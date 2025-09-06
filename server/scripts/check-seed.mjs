import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const [accounts, seminars, stacks, items, txs, inquiries, faqs] = await Promise.all([
      prisma.account.count(),
      prisma.seminar.count(),
      prisma.itemStack.count(),
      prisma.inventoryItem.count(),
      prisma.itemTransaction.count(),
      prisma.inquiry.count(),
      prisma.fAQ.count(),
    ]);

    console.log(JSON.stringify({ accounts, seminars, items, stacks, transactions: txs, inquiries, faqs }, null, 2));
  } catch (e) {
    console.error('check failed:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
