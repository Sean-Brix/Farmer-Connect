import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Fix planting report states after migration
 * - Records with state defaulted to 'Planting' need proper mapping based on data
 * - Update stateHistory JSON to reflect correct state transitions
 */

async function fixStateMigration() {
  console.log('Starting state migration fix...\n');

  try {
    // Get all planting reports
    const reports = await prisma.plantingReport.findMany({
      select: {
        id: true,
        farmerName: true,
        state: true,
        distributionRequestId: true,
        dateOfPlanting: true,
        dateOfExpectedHarvest: true,
        numberOfBags: true,
        harvestArea: true,
        stateHistory: true,
        createdAt: true,
      },
    });

    console.log(`Found ${reports.length} total reports\n`);

    let fixed = 0;
    let skipped = 0;

    for (const report of reports) {
      let newState = report.state;
      let needsUpdate = false;
      let stateHistory = [];

      // Parse existing state history
      try {
        stateHistory = report.stateHistory ? JSON.parse(report.stateHistory) : [];
      } catch (e) {
        console.log(`⚠️  Invalid stateHistory JSON for report ${report.id}, resetting`);
        stateHistory = [];
      }

      // Determine correct state based on data
      if (report.harvestArea || report.numberOfBags) {
        // Has harvest data → should be Harvested
        if (report.state !== 'Harvested') {
          newState = 'Harvested';
          needsUpdate = true;
        }
      } else if (report.dateOfPlanting) {
        // Has planting date → should be Planted
        if (report.state !== 'Planted') {
          newState = 'Planted';
          needsUpdate = true;
        }
      } else {
        // No planting date yet → should be Distributed or Planting
        if (report.distributionRequestId) {
          if (report.state !== 'Distributed') {
            newState = 'Distributed';
            needsUpdate = true;
          }
        } else {
          if (report.state !== 'Planting') {
            newState = 'Planting';
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        // Build corrected state history
        const correctedHistory = [
          {
            state: report.distributionRequestId ? 'Distributed' : 'Planting',
            timestamp: report.createdAt.toISOString(),
            by: 'SYSTEM_MIGRATION',
          },
        ];

        if (newState === 'Planted' || newState === 'Harvested') {
          correctedHistory.push({
            state: 'Planted',
            timestamp: report.dateOfPlanting?.toISOString() || report.createdAt.toISOString(),
            by: 'SYSTEM_MIGRATION',
          });
        }

        if (newState === 'Harvested') {
          correctedHistory.push({
            state: 'Harvested',
            timestamp: report.dateOfExpectedHarvest?.toISOString() || new Date().toISOString(),
            by: 'SYSTEM_MIGRATION',
          });
        }

        // Update the report
        await prisma.plantingReport.update({
          where: { id: report.id },
          data: {
            state: newState,
            stateHistory: JSON.stringify(correctedHistory),
          },
        });

        console.log(
          `✅ Fixed report ${report.id} (${report.farmerName}): ${report.state} → ${newState}`
        );
        fixed++;
      } else {
        skipped++;
      }
    }

    console.log(`\n✅ Migration fix complete!`);
    console.log(`   Fixed: ${fixed} reports`);
    console.log(`   Skipped: ${skipped} reports (already correct)`);
  } catch (error) {
    console.error('❌ Error fixing state migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixStateMigration()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
