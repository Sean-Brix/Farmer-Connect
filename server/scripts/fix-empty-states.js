import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Fix empty state values after enum migration
 * Set all empty strings to 'Planting' as default
 */

async function fixEmptyStates() {
  console.log('Checking for empty state values...\n');

  try {
    // Use raw SQL to update empty states
    const result = await prisma.$executeRawUnsafe(`
      UPDATE planting_reports 
      SET state = 'Planting' 
      WHERE state = '' OR state IS NULL
    `);

    console.log(`✅ Updated ${result} records with empty states to 'Planting'\n`);

    // Now get all records to properly classify them
    const reports = await prisma.$queryRawUnsafe(`
      SELECT id, farmerName, state, distributionRequestId, dateOfPlanting, 
             harvestArea, numberOfBags, dateOfExpectedHarvest
      FROM planting_reports
    `);

    console.log(`Found ${reports.length} total reports\n`);

    let updated = 0;
    
    for (const report of reports) {
      let correctState = report.state;
      
      // Determine correct state
      if (report.harvestArea || report.numberOfBags) {
        correctState = 'Harvested';
      } else if (report.dateOfPlanting) {
        correctState = 'Planted';
      } else if (report.distributionRequestId) {
        correctState = 'Distributed';
      } else {
        correctState = 'Planting';
      }

      if (correctState !== report.state) {
        await prisma.$executeRawUnsafe(`
          UPDATE planting_reports 
          SET state = ?, stateHistory = ?
          WHERE id = ?
        `, correctState, JSON.stringify([{
          state: correctState,
          timestamp: new Date().toISOString(),
          by: 'SYSTEM_MIGRATION'
        }]), report.id);

        console.log(`✅ ${report.farmerName}: ${report.state} → ${correctState}`);
        updated++;
      }
    }

    console.log(`\n✅ Migration complete! Updated ${updated} records.`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixEmptyStates()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
