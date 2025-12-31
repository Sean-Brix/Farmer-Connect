import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkHarvestedCounts() {
  console.log('Checking harvested report counts...\n');

  const total = await prisma.plantingReport.count({
    where: { state: 'Harvested' }
  });
  
  const notDeleted = await prisma.plantingReport.count({
    where: { state: 'Harvested', isDeleted: false }
  });

  const notDeletedNotArchived = await prisma.plantingReport.count({
    where: { state: 'Harvested', isDeleted: false, isArchived: false }
  });

  const archived = await prisma.plantingReport.count({
    where: { state: 'Harvested', isDeleted: false, isArchived: true }
  });

  const deleted = await prisma.plantingReport.count({
    where: { state: 'Harvested', isDeleted: true }
  });

  console.log('Harvested Report Counts:');
  console.log('========================');
  console.log(`Total Harvested: ${total}`);
  console.log(`Not Deleted: ${notDeleted}`);
  console.log(`Not Deleted & Not Archived: ${notDeletedNotArchived}`);
  console.log(`Archived (not deleted): ${archived}`);
  console.log(`Deleted: ${deleted}`);

  const reports = await prisma.plantingReport.findMany({
    where: { state: 'Harvested' },
    select: {
      id: true,
      farmerName: true,
      state: true,
      isArchived: true,
      isDeleted: true,
      createdAt: true
    }
  });

  console.log('\nAll Harvested Reports:');
  console.log('======================');
  reports.forEach(r => {
    console.log(`${r.farmerName} - Archived: ${r.isArchived}, Deleted: ${r.isDeleted}`);
  });

  await prisma.$disconnect();
}

checkHarvestedCounts().catch(console.error);
