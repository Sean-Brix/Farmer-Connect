// Data Migration Script for PlantingReport state system
// Run this AFTER applying the schema migration

import { PrismaClient } from '@prisma/client';

// Standalone client for migration; avoid shared singleton issues in scripts
const prisma = new PrismaClient();

async function migrateReportStates() {
  console.log('Starting data migration for PlantingReport state system...\n');

  try {
    const reports = await prisma.plantingReport.findMany({
      select: {
        id: true,
        dateOfPlanting: true,
        harvestArea: true,
        numberOfBags: true,
        weightPerBag: true
      }
    });

    console.log(`Found ${reports.length} reports to migrate\n`);

    let state1Count = 0; // Request_Report
    let state2Count = 0; // Planted
    let state3Count = 0; // Completed

    for (const report of reports) {
      let newState;

      if (!report.dateOfPlanting) {
        newState = 'Request_Report';
        state1Count++;
      } else if (!report.harvestArea || !report.numberOfBags || !report.weightPerBag) {
        newState = 'Planted';
        state2Count++;
      } else {
        newState = 'Completed';
        state3Count++;
      }

      const stateHistory = [{
        from: null,
        to: newState,
        timestamp: new Date(),
        by: 'SYSTEM',
        reason: 'Data migration from old status system'
      }];

      await prisma.plantingReport.update({
        where: { id: report.id },
        data: {
          state: newState,
          stateHistory
        }
      });
    }

    console.log('Migration complete!\n');
    console.log('Summary:');
    console.log(`  State 1 (Request_Report): ${state1Count} reports`);
    console.log(`  State 2 (Planted):        ${state2Count} reports`);
    console.log(`  State 3 (Completed):      ${state3Count} reports`);
    console.log(`  Total:                    ${reports.length} reports\n`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateReportStates();
