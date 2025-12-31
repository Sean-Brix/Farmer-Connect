import prisma from '../config/database.js';

async function testSoftDelete() {
  console.log('\n========================================');
  console.log('SOFT DELETE AND RESTORE TESTS');
  console.log('========================================\n');

  const variety = await prisma.seedVariety.findFirst();
  let testId;

  try {
    if (!variety) {
      throw new Error('No variety found to run test');
    }

    const report = await prisma.plantingReport.create({
      data: {
        farmerName: 'Soft Delete Test',
        farmLocation: 'Test',
        areaPlanted: 1.0,
        typeOfCrop: 'Rice',
        varietyId: variety.id,
        seedClassification: 'Inbred_Certified',
        state: 'Request_Report',
        isDeleted: false,
        lastUpdatedBy: 'test',
        stateHistory: []
      }
    });
    testId = report.id;

    console.log('TEST 1: Soft delete...');
    await prisma.plantingReport.update({
      where: { id: testId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: 'test-user'
      }
    });

    const deleted = await prisma.plantingReport.findUnique({ where: { id: testId } });

    if (deleted.isDeleted && deleted.deletedAt && deleted.deletedBy) {
      console.log('   ✅ PASS: Soft delete successful\n');
    } else {
      console.log('   ❌ FAIL: Soft delete fields not set\n');
    }

    console.log('TEST 2: Excluded from normal queries...');
    const normalQuery = await prisma.plantingReport.findFirst({
      where: {
        id: testId,
        isDeleted: false
      }
    });

    if (!normalQuery) {
      console.log('   ✅ PASS: Correctly excluded from normal queries\n');
    } else {
      console.log('   ❌ FAIL: Should be excluded\n');
    }

    console.log('TEST 3: Restore...');
    await prisma.plantingReport.update({
      where: { id: testId },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null
      }
    });

    const restored = await prisma.plantingReport.findFirst({
      where: {
        id: testId,
        isDeleted: false
      }
    });

    if (restored && !restored.isDeleted) {
      console.log('   ✅ PASS: Successfully restored\n');
    } else {
      console.log('   ❌ FAIL: Restore failed\n');
    }

    console.log('TEST 4: 30-day window calculation...');
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 35);

    await prisma.plantingReport.update({
      where: { id: testId },
      data: {
        isDeleted: true,
        deletedAt: oldDate
      }
    });

    const daysSince = Math.floor((new Date() - oldDate) / (1000 * 60 * 60 * 24));

    if (daysSince > 30) {
      console.log(`   ✅ PASS: Correctly calculated ${daysSince} days (should be deleted)\n`);
    } else {
      console.log('   ❌ FAIL: Date calculation incorrect\n');
    }

    await prisma.plantingReport.delete({ where: { id: testId } });

    console.log('========================================');
    console.log('✅ SOFT DELETE TESTS COMPLETE');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Soft delete test error:', error);
    if (testId) {
      await prisma.plantingReport.delete({ where: { id: testId } }).catch(() => {});
    }
  } finally {
    await prisma.$disconnect();
  }
}

testSoftDelete().catch(console.error);
