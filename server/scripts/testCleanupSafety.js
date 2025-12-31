/**
 * SAFETY TEST - Verify cleanup job only affects soft-deleted reports
 * Usage: node scripts/testCleanupSafety.js
 */
import prisma from '../config/database.js';
import { cleanupOldDeletedReports } from '../jobs/cleanupDeletedReports.js';

async function testSafety() {
  console.log('SAFETY TEST: Cleanup Job\n');

  const beforeCounts = {
    total: await prisma.plantingReport.count(),
    active: await prisma.plantingReport.count({ where: { isDeleted: false } }),
    deleted: await prisma.plantingReport.count({ where: { isDeleted: true } })
  };

  console.log('Before cleanup:');
  console.log(`  Total: ${beforeCounts.total}`);
  console.log(`  Active: ${beforeCounts.active}`);
  console.log(`  Deleted: ${beforeCounts.deleted}\n`);

  const result = await cleanupOldDeletedReports();

  const afterCounts = {
    total: await prisma.plantingReport.count(),
    active: await prisma.plantingReport.count({ where: { isDeleted: false } }),
    deleted: await prisma.plantingReport.count({ where: { isDeleted: true } })
  };

  console.log('After cleanup:');
  console.log(`  Total: ${afterCounts.total}`);
  console.log(`  Active: ${afterCounts.active}`);
  console.log(`  Deleted: ${afterCounts.deleted}\n`);

  const safetyChecks = {
    activeUnchanged: beforeCounts.active === afterCounts.active,
    deletedReduced: afterCounts.deleted <= beforeCounts.deleted,
    totalReduced: afterCounts.total <= beforeCounts.total
  };

  console.log('Safety Checks:');
  console.log(`  ✅ Active reports unchanged: ${safetyChecks.activeUnchanged}`);
  console.log(`  ✅ Deleted count reduced: ${safetyChecks.deletedReduced}`);
  console.log(`  ✅ Total reduced appropriately: ${safetyChecks.totalReduced}\n`);

  if (Object.values(safetyChecks).every(Boolean)) {
    console.log('✅ SAFETY TEST PASSED\n');
  } else {
    console.error('❌ SAFETY TEST FAILED\n');
    process.exit(1);
  }

  await prisma.$disconnect();

  return { beforeCounts, afterCounts, result };
}

testSafety().catch((err) => {
  console.error(err);
  prisma.$disconnect();
});
