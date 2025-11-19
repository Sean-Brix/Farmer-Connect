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
 * Creates pending report for first stage (planting day report)
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

  // Calculate report due date (stage end + 5 days grace period)
  const reportDueDate = new Date(stageEndDate);
  reportDueDate.setDate(reportDueDate.getDate() + 5);

  // Update crop with first stage info
  await prisma.registeredCrop.update({
    where: { id: cropId },
    data: {
      currentStageIndex: 0,
      currentStageName: firstStage.stageName,
      currentStageStartDate: stageStartDate,
      currentStageEndDate: stageEndDate,
      totalStages: stages.length
    }
  });

  // NOTE: Do NOT create pending report immediately
  // Reports are created only AFTER stage duration completes (when advancing to next stage)
  // This allows the stage to be "in progress" first before requiring a report

  return {
    currentStageIndex: 0,
    currentStageName: firstStage.stageName,
    currentStageStartDate: stageStartDate,
    currentStageEndDate: stageEndDate,
    reportDueDate: reportDueDate // For reference only
  };
}

/**
 * Check if farmer can submit a report for a specific stage
 * Returns report status and submission window info
 */
export async function canSubmitReportForStage(cropId, targetStageIndex = null) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      reports: true
    }
  });

  if (!crop) {
    return { canSubmit: false, reason: 'Crop not found' };
  }

  // Check if crop is still active
  if (crop.status !== 'Active') {
    return { canSubmit: false, reason: 'Crop is not active' };
  }

  // If no target stage specified, use current stage
  const stageToCheck = targetStageIndex !== null ? targetStageIndex : crop.currentStageIndex;

  // Check if all stages completed
  if (stageToCheck >= crop.totalStages) {
    return { canSubmit: false, reason: 'All stages completed' };
  }

  // Find the report for this stage
  const stageReport = crop.reports.find(r => r.stageIndex === stageToCheck);

  if (!stageReport) {
    return { 
      canSubmit: false, 
      reason: `Report for stage ${stageToCheck + 1} not yet available. Wait for stage to complete.`,
      stageIndex: stageToCheck
    };
  }

  // Check report status
  if (stageReport.status === 'Submitted') {
    return { 
      canSubmit: false, 
      reason: `Report already submitted for stage ${stageToCheck + 1}`,
      stageIndex: stageToCheck,
      submittedAt: stageReport.submittedAt
    };
  }

  const now = new Date();
  const dueDate = new Date(stageReport.reportDueDate);

  // Can submit if report is Pending or Late (allow late submissions)
  return { 
    canSubmit: true,
    stageIndex: stageToCheck,
    stageName: stageReport.stageName,
    status: stageReport.status,
    reportDueDate: stageReport.reportDueDate,
    isOverdue: now > dueDate,
    daysOverdue: now > dueDate ? Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)) : 0
  };
}

/**
 * Advance to next stage and create pending report for the PREVIOUS stage
 * Called when stage duration expires
 */
export async function advanceToNextStage(cropId, createPendingReport = true) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      guideline: {
        include: {
          stages: {
            orderBy: { sequenceOrder: 'asc' }
          }
        }
      },
      reports: true
    }
  });

  if (!crop || !crop.guideline) {
    throw new Error('Crop or guideline not found');
  }

  const currentStageIndex = crop.currentStageIndex;
  const nextStageIndex = currentStageIndex + 1;
  const totalStages = crop.guideline.stages.length;

  // Calculate report due date for current stage (just completed)
  // Report window = stage end date + 5 days grace period
  const currentStageEndDate = new Date(crop.currentStageEndDate);
  const reportDueDate = new Date(currentStageEndDate);
  reportDueDate.setDate(reportDueDate.getDate() + 5);

  // Create pending report for the stage that just ended (if not already exists)
  if (createPendingReport && currentStageIndex >= 0) {
    const existingReport = crop.reports.find(r => r.stageIndex === currentStageIndex);
    
    if (!existingReport) {
      const currentStage = crop.guideline.stages[currentStageIndex];
      await prisma.stageReport.create({
        data: {
          cropId: cropId,
          stageIndex: currentStageIndex,
          stageName: currentStage.stageName,
          status: 'Pending',
          reportDueDate: reportDueDate
        }
      });
    }
  }

  // Check if there's a next stage
  if (nextStageIndex >= totalStages) {
    // All stages completed, mark crop as completed
    await prisma.registeredCrop.update({
      where: { id: cropId },
      data: {
        currentStageIndex: nextStageIndex,
        status: 'Completed'
      }
    });

    return {
      completed: true,
      message: 'All stages completed! Crop marked as completed.',
      reportCreated: createPendingReport,
      reportDueDate: reportDueDate
    };
  }

  // Get next stage info
  const nextStage = crop.guideline.stages[nextStageIndex];
  const nextStageDuration = parseDurationToDays(nextStage.duration);
  
  // Calculate next stage start and end dates
  const stageStartDate = new Date(currentStageEndDate);
  const stageEndDate = new Date(stageStartDate);
  stageEndDate.setDate(stageEndDate.getDate() + nextStageDuration);

  // Update crop to next stage
  await prisma.registeredCrop.update({
    where: { id: cropId },
    data: {
      currentStageIndex: nextStageIndex,
      currentStageName: nextStage.stageName,
      currentStageStartDate: stageStartDate,
      currentStageEndDate: stageEndDate
    }
  });

  return {
    completed: false,
    currentStageIndex: nextStageIndex,
    currentStageName: nextStage.stageName,
    currentStageStartDate: stageStartDate,
    currentStageEndDate: stageEndDate,
    previousStageReportDueDate: reportDueDate,
    message: `Advanced to stage ${nextStageIndex + 1}: ${nextStage.stageName}. Report for previous stage is now open.`
  };
}

/**
 * Auto-check and advance stages if duration has expired
 * Also marks overdue reports as Late
 */
export async function checkAndAutoAdvanceStage(cropId) {
  const crop = await prisma.registeredCrop.findUnique({
    where: { id: cropId },
    include: {
      guideline: {
        include: {
          stages: {
            orderBy: { sequenceOrder: 'asc' }
          }
        }
      },
      reports: true
    }
  });

  if (!crop || crop.status !== 'Active') {
    return { advanced: false, reason: 'Crop not active' };
  }

  const now = new Date();
  const stageEndDate = crop.currentStageEndDate ? new Date(crop.currentStageEndDate) : null;

  // First, mark any overdue reports as Late
  const overdueReports = crop.reports.filter(report => {
    if (report.status !== 'Pending') return false;
    const dueDate = new Date(report.reportDueDate);
    return now > dueDate;
  });

  for (const report of overdueReports) {
    await prisma.stageReport.update({
      where: { id: report.id },
      data: { status: 'Late' }
    });
  }

  // Check if current stage has expired
  if (!stageEndDate || now < stageEndDate) {
    return { 
      advanced: false, 
      reason: 'Stage not yet complete',
      lateReportsMarked: overdueReports.length
    };
  }

  // Stage has ended, advance to next stage
  const result = await advanceToNextStage(cropId, true);
  
  return {
    advanced: true,
    ...result,
    lateReportsMarked: overdueReports.length
  };
}

/**
 * Get pending and late reports for a crop
 */
export async function getPendingReports(cropId) {
  const reports = await prisma.stageReport.findMany({
    where: {
      cropId: cropId,
      status: {
        in: ['Pending', 'Late']
      }
    },
    orderBy: {
      stageIndex: 'asc'
    }
  });

  const now = new Date();
  
  return reports.map(report => ({
    id: report.id,
    stageIndex: report.stageIndex,
    stageName: report.stageName,
    status: report.status,
    reportDueDate: report.reportDueDate,
    isOverdue: now > new Date(report.reportDueDate),
    daysOverdue: now > new Date(report.reportDueDate) 
      ? Math.ceil((now - new Date(report.reportDueDate)) / (1000 * 60 * 60 * 24))
      : 0
  }));
}

/**
 * Get current stage information for a crop
 * Includes auto-advance check
 */
export async function getCurrentStageInfo(cropId) {
  // Auto-advance if needed
  await checkAndAutoAdvanceStage(cropId);

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
        orderBy: { stageIndex: 'asc' }
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

  // Get pending reports
  const pendingReports = crop.reports.filter(r => r.status === 'Pending' || r.status === 'Late');

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
    daysRemaining: Math.max(0, daysRemaining),
    pendingReports: pendingReports.map(r => ({
      id: r.id,
      stageIndex: r.stageIndex,
      stageName: r.stageName,
      status: r.status,
      reportDueDate: r.reportDueDate,
      isOverdue: now > new Date(r.reportDueDate)
    })),
    allStages: crop.guideline?.stages.map((s, idx) => {
      const stageReport = crop.reports.find(r => r.stageIndex === idx);
      return {
        index: idx,
        name: s.stageName,
        duration: s.duration,
        hasReport: !!stageReport,
        reportStatus: stageReport?.status,
        reportDueDate: stageReport?.reportDueDate,
        reportSubmittedAt: stageReport?.submittedAt
      };
    }) || []
  };
}

export default {
  parseDurationToDays,
  calculateStageWindows,
  initializeCropStages,
  canSubmitReportForStage,
  advanceToNextStage,
  checkAndAutoAdvanceStage,
  getPendingReports,
  getCurrentStageInfo
};
