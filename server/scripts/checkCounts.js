import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const counts = {
    request: await prisma.plantingReport.count({ 
      where: { state: 'Request_Report', isDeleted: false, isArchived: false } 
    }),
    planted: await prisma.plantingReport.count({ 
      where: { state: 'Planted', isDeleted: false, isArchived: false } 
    }),
    completed: await prisma.plantingReport.count({ 
      where: { state: 'Completed', isDeleted: false, isArchived: false } 
    }),
    archived: await prisma.plantingReport.count({ 
      where: { isArchived: true, isDeleted: false } 
    }),
    deleted: await prisma.plantingReport.count({ 
      where: { isDeleted: true } 
    })
  };
  
  console.log('\n📊 Database Counts:');
  console.log('==================');
  console.log(`Request Reports: ${counts.request}`);
  console.log(`Planted Reports: ${counts.planted}`);
  console.log(`Completed Reports: ${counts.completed}`);
  console.log(`Archived Reports: ${counts.archived}`);
  console.log(`Deleted Reports: ${counts.deleted}`);
  console.log(`All Reports (non-deleted, non-archived): ${counts.request + counts.planted + counts.completed}`);
  
  await prisma.$disconnect();
}

main();
