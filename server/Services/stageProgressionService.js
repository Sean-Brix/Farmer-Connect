import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Parse duration string to days
 * Examples: "21 days", "2-3 weeks", "14-21 days", "1 month"
 */
function parseDurationToDays(durationStr) {
  if (!durationStr) return 0;
  
  // Extract numbers and unit
  const match = durationStr.match(/(\d+)(?:-(\d+))?\s*(day|days|week|weeks|month|months)/i);
  if (!match) return 0;
  
  const minValue = parseInt(match[1]);
  const maxValue = match[2] ? parseInt(match[2]) : minValue;
  const unit = match[3].toLowerCase();
  
  // Use average if range given
  const avgValue = (minValue + maxValue) / 2;
  
  // Convert to days
  switch(unit) {
    case 'day':
    case 'days':
      return avgValue;
    case 'week':
    case 'weeks':
      return avgValue * 7;
    case 'month':
    case 'months':
      return avgValue * 30;
    default:
      return avgValue;
  }
}

/**
 * Calculate all stage windows for a registered crop
 * Returns array of stage periods with start/end dates
 */
export async function calculateStageWindows(cropId) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      guideline: {
        include: {
          stages: {
            orderBy: { sequenceOrder: 'asc' }
          }
        }
      }
    }
  });

  if (!crop || !crop.guideline || !crop.guideline.stages.length) {
    return [];
  }

  const stages = crop.guideline.stages;
  const plantingDate = new Date(crop.plantingDate);
  const windows = [];
  let currentDate = new Date(plantingDate);

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const durationDays = parseDurationToDays(stage.duration);
    
    const stageStart = new Date(currentDate);
    const stageEnd = new Date(currentDate);
    stageEnd.setDate(stageEnd.getDate() + durationDays);

    windows.push({
      stageIndex: i,
      stageName: stage.stageName,
      stageId: stage.id,
      duration: stage.duration,
      durationDays: durationDays,
      startDate: stageStart,
      endDate: stageEnd,
      description: stage.description,
      activities: JSON.parse(stage.activities || '[]')
    });

    // Next stage starts when this one ends
    currentDate = new Date(stageEnd);
  }

  return windows;
}

/**
 * Initialize stage tracking when crop is registered
 */
export async function initializeCropStages(cropId) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      guideline: {
        include: {
          stages: {
            orderBy: { sequenceOrder: 'asc' }
          }
        }
      }
    }
  });

  if (!crop || !crop.guideline || !crop.guideline.stages.length) {
    throw new Error('Crop must have a guideline with stages');
  }

  const stages = crop.guideline.stages;
  const firstStage = stages[0];
  const firstStageDuration = parseDurationToDays(firstStage.duration);
  
  const stageStartDate = new Date(crop.plantingDate);
  const stageEndDate = new Date(crop.plantingDate);
  stageEndDate.setDate(stageEndDate.getDate() + firstStageDuration);

  // Update crop with first stage info
  await prisma.registeredCrop.update({
    where: { id: cropId },
    data: {
      currentStageIndex: 0,
      currentStageName: firstStage.stageName,
      currentStageStartDate: stageStartDate,
      currentStageEndDate: stageEndDate,
      canSubmitReport: true, // First stage can be reported immediately (planting day)
      totalStages: stages.length,
      completedStages: 0
    }
  });

  return {
    currentStageIndex: 0,
    currentStageName: firstStage.stageName,
    currentStageStartDate: stageStartDate,
    currentStageEndDate: stageEndDate
  };
}

/**
 * Check if farmer can submit a report for current stage
 */
export async function canSubmitReportForStage(cropId) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      reports: {
        where: {
          stageIndex: { gte: 0 } // Get all reports
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!crop) {
    return { canSubmit: false, reason: 'Crop not found' };
  }

  // Check if crop is still active
  if (crop.status !== 'Active') {
    return { canSubmit: false, reason: 'Crop is not active' };
  }

  // Check if all stages completed
  if (crop.currentStageIndex >= crop.totalStages) {
    return { canSubmit: false, reason: 'All stages completed' };
  }

  // Check if already submitted report for current stage
  const hasReportForCurrentStage = crop.reports.some(
    report => report.stageIndex === crop.currentStageIndex
  );

  if (hasReportForCurrentStage) {
    return { 
      canSubmit: false, 
      reason: `Report already submitted for stage ${crop.currentStageIndex + 1}: ${crop.currentStageName}`,
      nextStageIndex: crop.currentStageIndex + 1
    };
  }

  // Check if current stage duration has passed
  const now = new Date();
  const stageEndDate = new Date(crop.currentStageEndDate);

  // For first stage (planting), can report immediately
  if (crop.currentStageIndex === 0) {
    return { 
      canSubmit: true, 
      currentStageIndex: crop.currentStageIndex,
      currentStageName: crop.currentStageName,
      stageEndDate: stageEndDate
    };
  }

  // For other stages, must wait until stage end date
  if (now < stageEndDate) {
    const daysRemaining = Math.ceil((stageEndDate - now) / (1000 * 60 * 60 * 24));
    return { 
      canSubmit: false, 
      reason: `Current stage "${crop.currentStageName}" not yet complete. ${daysRemaining} days remaining`,
      daysRemaining: daysRemaining,
      stageEndDate: stageEndDate,
      currentStageIndex: crop.currentStageIndex,
      currentStageName: crop.currentStageName
    };
  }

  return { 
    canSubmit: true,
    currentStageIndex: crop.currentStageIndex,
    currentStageName: crop.currentStageName,
    stageEndDate: stageEndDate
  };
}

/**
 * Advance to next stage after successful report submission
 */
export async function advanceToNextStage(cropId) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      guideline: {
        include: {
          stages: {
            orderBy: { sequenceOrder: 'asc' }
          }
        }
      }
    }
  });

  if (!crop || !crop.guideline) {
    throw new Error('Crop or guideline not found');
  }

  const nextStageIndex = crop.currentStageIndex + 1;
  const totalStages = crop.guideline.stages.length;

  // Check if there's a next stage
  if (nextStageIndex >= totalStages) {
    // All stages completed, mark crop as completed
    await prisma.registeredCrop.update({
      where: { id: cropId },
      data: {
        currentStageIndex: nextStageIndex,
        canSubmitReport: false,
        completedStages: totalStages,
        status: 'Completed',
        lastReportDate: new Date()
      }
    });

    return {
      completed: true,
      message: 'All stages completed! Crop marked as completed.'
    };
  }

  // Get next stage info
  const nextStage = crop.guideline.stages[nextStageIndex];
  const nextStageDuration = parseDurationToDays(nextStage.duration);
  
  // Calculate next stage start and end dates
  const stageStartDate = new Date(crop.currentStageEndDate);
  const stageEndDate = new Date(stageStartDate);
  stageEndDate.setDate(stageEndDate.getDate() + nextStageDuration);

  // Update crop to next stage
  await prisma.registeredCrop.update({
    where: { id: cropId },
    data: {
      currentStageIndex: nextStageIndex,
      currentStageName: nextStage.stageName,
      currentStageStartDate: stageStartDate,
      currentStageEndDate: stageEndDate,
      canSubmitReport: false, // Must wait for duration
      completedStages: nextStageIndex,
      lastReportDate: new Date()
    }
  });

  return {
    completed: false,
    currentStageIndex: nextStageIndex,
    currentStageName: nextStage.stageName,
    currentStageStartDate: stageStartDate,
    currentStageEndDate: stageEndDate,
    message: `Advanced to stage ${nextStageIndex + 1}: ${nextStage.stageName}`
  };
}

/**
 * Get current stage information for a crop
 */
export async function getCurrentStageInfo(cropId) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      guideline: {
        include: {
          stages: {
            where: {
              sequenceOrder: { gte: 0 }
            },
            orderBy: { sequenceOrder: 'asc' }
          }
        }
      },
      reports: {
        orderBy: { stageIndex: 'desc' }
      }
    }
  });

  if (!crop) {
    return null;
  }

  const currentStage = crop.guideline?.stages[crop.currentStageIndex];
  const now = new Date();
  const stageEndDate = crop.currentStageEndDate ? new Date(crop.currentStageEndDate) : null;
  const daysRemaining = stageEndDate ? Math.ceil((stageEndDate - now) / (1000 * 60 * 60 * 24)) : 0;

  // Check if report exists for current stage
  const hasReportForStage = crop.reports.some(r => r.stageIndex === crop.currentStageIndex);

  return {
    cropId: crop.id,
    cropType: crop.cropType,
    variety: crop.variety,
    plantingDate: crop.plantingDate,
    status: crop.status,
    currentStageIndex: crop.currentStageIndex,
    currentStageName: crop.currentStageName,
    currentStageStartDate: crop.currentStageStartDate,
    currentStageEndDate: crop.currentStageEndDate,
    currentStageDetails: currentStage ? {
      stageName: currentStage.stageName,
      duration: currentStage.duration,
      description: currentStage.description,
      activities: JSON.parse(currentStage.activities || '[]')
    } : null,
    totalStages: crop.totalStages,
    completedStages: crop.completedStages,
    daysRemaining: Math.max(0, daysRemaining),
    canSubmitReport: daysRemaining <= 0 && !hasReportForStage && crop.status === 'Active',
    hasReportForCurrentStage: hasReportForStage,
    allStages: crop.guideline?.stages.map((s, idx) => ({
      index: idx,
      name: s.stageName,
      duration: s.duration,
      completed: idx < crop.currentStageIndex || (idx === crop.currentStageIndex && hasReportForStage)
    })) || []
  };
}

export default {
  parseDurationToDays,
  calculateStageWindows,
  initializeCropStages,
  canSubmitReportForStage,
  advanceToNextStage,
  getCurrentStageInfo
};
