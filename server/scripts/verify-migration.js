import prisma from '../config/database.js';

async function verifyMigration() {
  console.log('Verifying PlantingReport migration...\n');

  try {
    // Count by state (will throw if state column missing)
    const state1Count = await prisma.plantingReport.count({ where: { state: 'Request_Report' } });
    const state2Count = await prisma.plantingReport.count({ where: { state: 'Planted' } });
    const state3Count = await prisma.plantingReport.count({ where: { state: 'Completed' } });

    console.log('\nState Distribution:');
    console.log(`  Request_Report: ${state1Count}`);
    console.log(`  Planted:        ${state2Count}`);
    console.log(`  Completed:      ${state3Count}`);

    const deletedCount = await prisma.plantingReport.count({ where: { isDeleted: true } });
    console.log(`\nSoft-deleted reports: ${deletedCount}`);

    const archivedCount = await prisma.plantingReport.count({ where: { isArchived: true } });
    console.log(`Archived reports: ${archivedCount}`);

    const reportsWithHistory = await prisma.plantingReport.count({ where: { stateHistory: { not: null } } });
    console.log(`Reports with stateHistory: ${reportsWithHistory}`);

    const state1WithoutMethod = await prisma.plantingReport.count({
      where: { state: 'Request_Report', plantingMethod: null }
    });
    console.log(`State 1 reports without plantingMethod: ${state1WithoutMethod}`);

    console.log('\nMigration verification complete.\n');
  } catch (error) {
    console.error('Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration();
