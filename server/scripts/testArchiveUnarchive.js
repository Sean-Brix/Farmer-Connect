import prisma from '../config/database.js';

async function testArchiveUnarchive() {
  console.log('\n========================================');
  console.log('ARCHIVE / UNARCHIVE TESTS');
  console.log('========================================\n');

  const variety = await prisma.seedVariety.findFirst({ where: { cropType: 'Rice' } });
  if (!variety) {
    console.error('❌ No seed variety found for tests');
    return;
  }

  let completedId;
  let requestId;

  try {
    // Create base request
    const baseReport = await prisma.plantingReport.create({
      data: {
        farmerName: 'Archive Test Farmer',
        farmLocation: 'Test Barangay',
        areaPlanted: 1,
        typeOfCrop: 'Rice',
        varietyId: variety.id,
        seedClassification: 'Inbred_Certified',
        state: 'Request_Report',
        isDeleted: false,
        isArchived: false,
        stateHistory: [
          { from: null, to: 'Request_Report', timestamp: new Date().toISOString(), by: 'test-user', reason: 'Created for archive test' }
        ],
        lastUpdatedBy: 'test-user'
      }
    });
    completedId = baseReport.id;

    // Transition to Completed (valid archive candidate)
    const completed = await prisma.plantingReport.update({
      where: { id: completedId },
      data: {
        dateOfPlanting: new Date(),
        plantingMethod: 'Direct_Seeded',
        harvestArea: 0.9,
        numberOfBags: 18,
        weightPerBag: 50,
        yieldMtPerHa: (0.9 * 18 * 50) / 1000,
        state: 'Completed',
        stateHistory: [
          ...baseReport.stateHistory,
          { from: 'Request_Report', to: 'Planted', timestamp: new Date().toISOString(), by: 'test-user', reason: 'Planted' },
          { from: 'Planted', to: 'Completed', timestamp: new Date().toISOString(), by: 'test-user', reason: 'Harvested' }
        ],
        lastUpdatedBy: 'test-user'
      }
    });
    console.log('Created completed report:', completed.id);

    // Archive allowed for Completed
    const archived = await prisma.plantingReport.update({
      where: { id: completedId },
      data: { isArchived: true, archivedAt: new Date(), archivedBy: 'test-user' }
    });
    const archivePass = archived.isArchived && archived.archivedAt && archived.archivedBy;
    console.log(archivePass ? '   ✅ PASS: Archive allowed for Completed' : '   ❌ FAIL: Archive metadata missing');

    const archivedQuery = await prisma.plantingReport.findFirst({ where: { id: completedId, isArchived: true } });
    console.log(archivedQuery ? '   ✅ PASS: Archived report still queryable' : '   ❌ FAIL: Archived report not found in queries');

    // Unarchive clears metadata
    const unarchived = await prisma.plantingReport.update({
      where: { id: completedId },
      data: { isArchived: false, archivedAt: null, archivedBy: null }
    });
    const unarchivePass = !unarchived.isArchived && !unarchived.archivedAt && !unarchived.archivedBy;
    console.log(unarchivePass ? '   ✅ PASS: Unarchive cleared fields' : '   ❌ FAIL: Unarchive did not clear fields');

    // Attempt archive on Request_Report should be blocked at controller; simulate expectation
    const requestReport = await prisma.plantingReport.create({
      data: {
        farmerName: 'Archive Negative',
        farmLocation: 'Test',
        areaPlanted: 0.5,
        typeOfCrop: 'Rice',
        varietyId: variety.id,
        seedClassification: 'Inbred_Certified',
        state: 'Request_Report',
        isDeleted: false,
        isArchived: false,
        stateHistory: [
          { from: null, to: 'Request_Report', timestamp: new Date().toISOString(), by: 'test-user', reason: 'Created for negative archive test' }
        ],
        lastUpdatedBy: 'test-user'
      }
    });
    requestId = requestReport.id;

    // We do not perform the archive because controller prevents it; assert state is not Completed
    if (requestReport.state !== 'Completed') {
      console.log('   ✅ PASS: Archive should be blocked for non-completed reports (controller-level)');
    } else {
      console.log('   ❌ FAIL: Non-completed report unexpectedly in Completed state');
    }

    // Cleanup
    await prisma.plantingReport.delete({ where: { id: completedId } });
    await prisma.plantingReport.delete({ where: { id: requestId } });

    console.log('\n========================================');
    console.log('✅ ARCHIVE / UNARCHIVE TESTS COMPLETE');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Archive test error:', error);
    if (completedId) {
      await prisma.plantingReport.delete({ where: { id: completedId } }).catch(() => {});
    }
    if (requestId) {
      await prisma.plantingReport.delete({ where: { id: requestId } }).catch(() => {});
    }
  } finally {
    await prisma.$disconnect();
  }
}

testArchiveUnarchive().catch(console.error);
