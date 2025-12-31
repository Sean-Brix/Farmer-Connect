/**
 * TEST SCRIPT - Cleanup Job
 * Usage: node scripts/testCleanup.js
 */
import prisma from '../config/database.js';
import { runCleanupNow } from '../jobs/cleanupDeletedReports.js';

async function testCleanup() {
  console.log('========================================');
  console.log('CLEANUP JOB TEST');
  console.log('========================================\n');

  // 1. Show current soft-deleted reports
  console.log('1. Checking for soft-deleted reports...\n');

  const deletedReports = await prisma.plantingReport.findMany({
    where: { isDeleted: true },
    select: { id: true, farmerName: true, deletedAt: true },
    orderBy: { deletedAt: 'asc' }
  });

  console.log(`   Found ${deletedReports.length} soft-deleted reports:`);
  deletedReports.forEach((report) => {
    const daysSinceDeletion = Math.floor(
      (Date.now() - new Date(report.deletedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const willDelete = daysSinceDeletion > 30 ? '❌ WILL DELETE' : '✅ Safe';
    console.log(`   ${willDelete} | ${report.farmerName} | ${daysSinceDeletion} days ago`);
  });

  // 2. Run cleanup
  console.log('\n2. Running cleanup job...\n');
  const result = await runCleanupNow();

  // 3. Show results
  console.log('\n3. Cleanup Results:');
  console.log(`   Success: ${result.success}`);
  console.log(`   Deleted: ${result.deleted || 0} reports`);

  if (result.reports && result.reports.length > 0) {
    console.log('\n   Deleted reports:');
    result.reports.forEach((r) => {
      console.log(`   - ${r.farmerName} (${r.id})`);
    });
  }

  console.log('\n========================================');
  console.log('TEST COMPLETE');
  console.log('========================================\n');

  await prisma.$disconnect();
}

testCleanup().catch((err) => {
  console.error(err);
  prisma.$disconnect();
});
