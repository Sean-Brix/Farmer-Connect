import prisma from '../config/database.js';

async function testE2EWorkflow() {
  console.log('\n========================================');
  console.log('END-TO-END WORKFLOW TEST');
  console.log('========================================\n');

  let testReportId;

  try {
    // Get a test variety and season
    const variety = await prisma.seedVariety.findFirst({ where: { cropType: 'Rice' } });
    const season = await prisma.plantingSeason.findFirst();

    if (!variety) {
      throw new Error('No variety found to run test');
    }

    // STEP 1: Create report (State 1: Request_Report)
    console.log('STEP 1: Create report (Request_Report)...');
    const report1 = await prisma.plantingReport.create({
      data: {
        farmerName: 'E2E Test Farmer',
        farmLocation: 'Test Barangay',
        areaPlanted: 2.5,
        typeOfCrop: 'Rice',
        varietyId: variety.id,
        croppingSeasonId: season?.id || null,
        seedClassification: 'Inbred_Certified',
        riceIrrigation: 'Irrigated',
        state: 'Request_Report',
        isDeleted: false,
        isArchived: false,
        stateHistory: [
          {
            from: null,
            to: 'Request_Report',
            timestamp: new Date().toISOString(),
            by: 'test-user',
            reason: 'Test created'
          }
        ],
        lastUpdatedBy: 'test-user'
      }
    });
    testReportId = report1.id;
    console.log(`   ✅ Created report ${testReportId}`);
    console.log(`   State: ${report1.state}\n`);

    if (report1.state !== 'Request_Report') {
      throw new Error('State should be Request_Report');
    }
    if (report1.dateOfPlanting !== null) {
      throw new Error('dateOfPlanting should be null in State 1');
    }

    // STEP 2: Transition to Planted (State 2)
    console.log('STEP 2: Transition to Planted...');
    const report2 = await prisma.plantingReport.update({
      where: { id: testReportId },
      data: {
        dateOfPlanting: new Date('2024-01-15'),
        plantingMethod: 'Transplanting',
        dateOfExpectedHarvest: new Date('2024-05-30'),
        state: 'Planted',
        stateHistory: [
          ...report1.stateHistory,
          {
            from: 'Request_Report',
            to: 'Planted',
            timestamp: new Date().toISOString(),
            by: 'test-user',
            reason: 'Planting completed'
          }
        ]
      }
    });
    console.log('   ✅ Transitioned to Planted');
    console.log(`   State: ${report2.state}`);
    console.log(`   Date of Planting: ${report2.dateOfPlanting}\n`);

    if (report2.state !== 'Planted') {
      throw new Error('State should be Planted');
    }
    if (!report2.dateOfPlanting) {
      throw new Error('dateOfPlanting required in State 2');
    }
    if (!report2.plantingMethod) {
      throw new Error('plantingMethod required in State 2');
    }

    // STEP 3: Transition to Completed (State 3)
    console.log('STEP 3: Transition to Completed...');
    const harvestArea = 2.3;
    const numberOfBags = 46;
    const weightPerBag = 50;
    const yieldMtPerHa = (harvestArea * numberOfBags * weightPerBag) / 1000;

    const report3 = await prisma.plantingReport.update({
      where: { id: testReportId },
      data: {
        harvestArea,
        numberOfBags,
        weightPerBag,
        yieldMtPerHa,
        state: 'Completed',
        stateHistory: [
          ...report2.stateHistory,
          {
            from: 'Planted',
            to: 'Completed',
            timestamp: new Date().toISOString(),
            by: 'test-user',
            reason: 'Harvest completed'
          }
        ]
      }
    });
    console.log('   ✅ Transitioned to Completed');
    console.log(`   State: ${report3.state}`);
    console.log(`   Yield: ${report3.yieldMtPerHa} Mt/Ha\n`);

    if (report3.state !== 'Completed') {
      throw new Error('State should be Completed');
    }
    if (!report3.harvestArea || !report3.numberOfBags || !report3.weightPerBag) {
      throw new Error('Harvest data required in State 3');
    }
    if (!report3.yieldMtPerHa) {
      throw new Error('Yield should be calculated');
    }

    // STEP 4: Archive
    console.log('STEP 4: Archive report...');
    const report4 = await prisma.plantingReport.update({
      where: { id: testReportId },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: 'test-user'
      }
    });
    console.log('   ✅ Report archived');
    console.log(`   Archived: ${report4.isArchived}\n`);

    // Verify state history
    console.log('STEP 5: Verify state history...');
    console.log(`   State history entries: ${report4.stateHistory.length}`);
    report4.stateHistory.forEach((entry, i) => {
      console.log(`   ${i + 1}. ${entry.from || 'NULL'} → ${entry.to} (${entry.reason})`);
    });

    if (report4.stateHistory.length !== 3) {
      throw new Error('Should have 3 state history entries');
    }

    console.log('\nCleaning up test data...');
    await prisma.plantingReport.delete({ where: { id: testReportId } });
    console.log('   ✅ Test data cleaned up\n');

    console.log('========================================');
    console.log('✅ END-TO-END WORKFLOW TEST PASSED');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ E2E Test Failed:', error.message);
    if (testReportId) {
      await prisma.plantingReport.delete({ where: { id: testReportId } }).catch(() => {});
    }
  } finally {
    await prisma.$disconnect();
  }
}

testE2EWorkflow().catch(console.error);
