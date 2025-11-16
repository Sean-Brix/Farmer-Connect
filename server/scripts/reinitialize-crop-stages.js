/**
 * Re-initialize crop stages after migration
 * This script properly calculates stage dates based on guideline durations
 * Run this after applying the manual migration
 */

import { PrismaClient } from '@prisma/client';
import { initializeCropStages } from '../Services/stageProgressionService.js';

const prisma = new PrismaClient();

async function reinitializeCropStages() {
  try {
    console.log('🌱 Starting crop stage re-initialization...\n');

    // Get all registered crops with their guidelines
    const crops = await prisma.registeredCrop.findMany({
      where: {
        guidelineId: { not: null }
      },
      include: {
        guideline: {
          include: {
            stages: {
              orderBy: { stageNumber: 'asc' }
            }
          }
        }
      }
    });

    console.log(`Found ${crops.length} crops to re-initialize\n`);

    let successCount = 0;
    let failedCount = 0;

    for (const crop of crops) {
      try {
        if (!crop.guideline || crop.guideline.stages.length === 0) {
          console.log(`⚠️  Skipping crop ${crop.id} (${crop.cropType}): No guideline or stages found`);
          failedCount++;
          continue;
        }

        // Re-initialize the crop stages based on guideline
        const updated = await initializeCropStages(crop);

        console.log(`✅ Re-initialized crop ${crop.id} (${crop.cropType} - ${crop.variety})`);
        console.log(`   Stage: ${updated.currentStageName} (${updated.currentStageIndex + 1}/${updated.totalStages})`);
        console.log(`   Start: ${updated.currentStageStartDate?.toLocaleDateString()}`);
        console.log(`   End: ${updated.currentStageEndDate?.toLocaleDateString()}`);
        console.log(`   Can submit: ${updated.canSubmitReport}\n`);

        successCount++;
      } catch (error) {
        console.error(`❌ Failed to re-initialize crop ${crop.id}:`, error.message);
        failedCount++;
      }
    }

    console.log('\n📊 Re-initialization Summary:');
    console.log(`   ✅ Success: ${successCount} crops`);
    console.log(`   ❌ Failed: ${failedCount} crops`);
    console.log(`   📝 Total: ${crops.length} crops\n`);

    if (successCount === crops.length) {
      console.log('🎉 All crops re-initialized successfully!');
    } else {
      console.log('⚠️  Some crops failed to re-initialize. Please review the errors above.');
    }

  } catch (error) {
    console.error('💥 Fatal error during re-initialization:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
reinitializeCropStages();
