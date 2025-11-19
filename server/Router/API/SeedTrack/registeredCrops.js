import express from 'express';
import { PrismaClient } from '@prisma/client';
import { getCurrentStageInfo, initializeCropStages } from '../../../Services/stageProgressionService.js';

const prisma = new PrismaClient();
const router = express.Router();

// Helper function to parse JSON string fields in reports
function parseReportJsonFields(report) {
  if (!report) return report;
  
  const parsed = { ...report };
  
  // Parse costs JSON string
  if (parsed.costs && typeof parsed.costs === 'string') {
    try {
      parsed.costs = JSON.parse(parsed.costs);
    } catch (e) {
      console.warn('Failed to parse costs JSON:', parsed.costs);
      parsed.costs = null;
    }
  }
  
  // Parse weatherSnapshot JSON string
  if (parsed.weatherSnapshot && typeof parsed.weatherSnapshot === 'string') {
    try {
      parsed.weatherSnapshot = JSON.parse(parsed.weatherSnapshot);
    } catch (e) {
      console.warn('Failed to parse weatherSnapshot JSON:', parsed.weatherSnapshot);
      parsed.weatherSnapshot = null;
    }
  }
  
  return parsed;
}

// Helper function to parse reports array
function parseReportsArray(crops) {
  if (!Array.isArray(crops)) return crops;
  
  return crops.map(crop => {
    if (crop.reports && Array.isArray(crop.reports)) {
      crop.reports = crop.reports.map(parseReportJsonFields);
    }
    return crop;
  });
}

// GET /api/seed-track/crops
router.get('/', async (req, res) => {
  try {
    const { userId, cropType, status, q, includeReports } = req.query;

    const where = {};
    if (userId) where.userId = userId;
    if (cropType) where.cropType = { contains: String(cropType), mode: 'insensitive' };
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { cropType: { contains: String(q), mode: 'insensitive' } },
        { variety: { contains: String(q), mode: 'insensitive' } },
        { notes: { contains: String(q), mode: 'insensitive' } },
      ];
    }

    const crops = await prisma.registeredCrop.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { 
        reports: includeReports === 'true',
        guideline: {
          include: {
            stages: {
              orderBy: { sequenceOrder: 'asc' }
            }
          }
        }
      },
    });

    // Parse JSON fields in reports
    const parsedCrops = parseReportsArray(crops);

    res.json({ success: true, data: parsedCrops });
  } catch (error) {
    console.error('[SeedTrack][Crops][LIST] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to list crops' });
  }
});

// GET /api/seed-track/crops/:id
router.get('/:id', async (req, res) => {
  try {
    const crop = await prisma.registeredCrop.findUnique({
      where: { id: req.params.id },
      include: { 
        reports: {
          orderBy: { stageIndex: 'asc' }
        },
        guideline: {
          include: {
            stages: {
              orderBy: { sequenceOrder: 'asc' }
            }
          }
        }
      },
    });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    
    // Parse JSON fields in reports
    if (crop.reports && Array.isArray(crop.reports)) {
      crop.reports = crop.reports.map(parseReportJsonFields);
    }

    // Get current stage information
    const stageInfo = await getCurrentStageInfo(crop.id);
    
    res.json({ 
      success: true, 
      data: crop,
      stageInfo: stageInfo 
    });
  } catch (error) {
    console.error('[SeedTrack][Crops][GET] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get crop' });
  }
});

// GET /api/seed-track/crops/:id/stage-info - Get current stage information
router.get('/:id/stage-info', async (req, res) => {
  try {
    const stageInfo = await getCurrentStageInfo(req.params.id);
    
    if (!stageInfo) {
      return res.status(404).json({ success: false, message: 'Crop not found or no stage information available' });
    }

    res.json({ success: true, stageInfo: stageInfo });
  } catch (error) {
    console.error('[SeedTrack][Crops][STAGE_INFO] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get stage info', error: error.message });
  }
});

// POST /api/seed-track/crops
router.post('/', async (req, res) => {
  try {
    const { userId, guidelineId, cropType, variety, plantingDate, expectedHarvest, area, notes } = req.body || {};
    
    // Validate required fields
    if (!userId || !guidelineId || !cropType || !variety || !plantingDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId, guidelineId, cropType, variety, and plantingDate are required' 
      });
    }

    // Check active crop limit (max 3 active crops per user)
    const activeCropsCount = await prisma.registeredCrop.count({
      where: {
        userId,
        status: {
          notIn: ['Completed', 'Archived']
        }
      }
    });

    if (activeCropsCount >= 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum of 3 active crops allowed. Please complete or archive an existing crop before registering a new one.' 
      });
    }

    // Verify guideline exists and has stages
    const guideline = await prisma.cropGuideline.findUnique({
      where: { id: guidelineId },
      include: {
        stages: {
          orderBy: { sequenceOrder: 'asc' }
        }
      }
    });

    if (!guideline) {
      return res.status(404).json({ 
        success: false, 
        message: 'Guideline not found' 
      });
    }

    if (!guideline.stages || guideline.stages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Guideline must have at least one stage defined' 
      });
    }

    // Create the crop
    const data = {
      userId,
      guidelineId,
      cropType,
      variety,
      plantingDate: new Date(plantingDate),
      expectedHarvest: expectedHarvest ? new Date(expectedHarvest) : null,
      area: area != null ? Number(area) : null,
      notes: notes || null,
      status: 'Active'
    };

    const created = await prisma.registeredCrop.create({ data });

    // Initialize stage tracking
    await initializeCropStages(created.id);

    // Fetch updated crop with stage info
    const cropWithStages = await prisma.registeredCrop.findUnique({
      where: { id: created.id },
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

    res.status(201).json({ 
      success: true, 
      data: cropWithStages,
      message: `Crop registered successfully! Current stage: ${cropWithStages.currentStageName}` 
    });
  } catch (error) {
    console.error('[SeedTrack][Crops][CREATE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create crop', error: error.message });
  }
});

// PATCH /api/seed-track/crops/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatable = ['guidelineId', 'cropType', 'variety', 'plantingDate', 'expectedHarvest', 'area', 'expectedYield', 'status', 'currentStage', 'currentStageIndex', 'notes'];
    const data = {};
    for (const key of updatable) {
      if (req.body[key] !== undefined) {
        if (['plantingDate', 'expectedHarvest'].includes(key)) data[key] = req.body[key] ? new Date(req.body[key]) : null;
        else if (['area', 'expectedYield'].includes(key)) data[key] = req.body[key] != null ? Number(req.body[key]) : null;
        else if (key === 'currentStageIndex') data[key] = req.body[key] != null ? Number(req.body[key]) : null;
        else data[key] = req.body[key];
      }
    }
    const updated = await prisma.registeredCrop.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('[SeedTrack][Crops][UPDATE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Crop not found' });
    res.status(500).json({ success: false, message: 'Failed to update crop' });
  }
});

// PATCH /api/seed-track/crops/:id/archive - Admin endpoint to archive a crop
router.patch('/:id/archive', async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await prisma.registeredCrop.update({
      where: { id: req.params.id },
      data: {
        status: 'Archived',
        notes: reason ? `Archived: ${reason}` : 'Archived by admin',
      },
    });
    res.json({ success: true, data: updated, message: 'Crop archived successfully' });
  } catch (error) {
    console.error('[SeedTrack][Crops][ARCHIVE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Crop not found' });
    res.status(500).json({ success: false, message: 'Failed to archive crop' });
  }
});

// PATCH /api/seed-track/crops/:id/complete - Mark crop as completed (harvested)
router.patch('/:id/complete', async (req, res) => {
  try {
    const updated = await prisma.registeredCrop.update({
      where: { id: req.params.id },
      data: {
        status: 'Completed',
        currentStage: 'Harvested',
      },
    });
    res.json({ success: true, data: updated, message: 'Crop marked as completed' });
  } catch (error) {
    console.error('[SeedTrack][Crops][COMPLETE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Crop not found' });
    res.status(500).json({ success: false, message: 'Failed to complete crop' });
  }
});

// PATCH /api/seed-track/crops/:id/skip-stage - Admin: Skip to next stage
router.patch('/:id/skip-stage', async (req, res) => {
  try {
    const crop = await prisma.registeredCrop.findUnique({
      where: { id: req.params.id },
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

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (!crop.guideline || !crop.guideline.stages || crop.guideline.stages.length === 0) {
      return res.status(400).json({ success: false, message: 'Crop has no guideline stages' });
    }

    const currentIndex = crop.currentStageIndex || 0;
    if (currentIndex >= crop.guideline.stages.length - 1) {
      return res.status(400).json({ success: false, message: 'Already at the last stage' });
    }

    // Use advanceToNextStage to properly create pending report for current stage
    const { advanceToNextStage } = await import('../../../Services/stageProgressionService.js');
    const result = await advanceToNextStage(req.params.id, true);

    res.json({ 
      success: true, 
      data: result, 
      message: `Stage advanced to: ${result.currentStageName}. Report for previous stage is now open.` 
    });
  } catch (error) {
    console.error('[SeedTrack][Crops][SKIP_STAGE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to skip stage' });
  }
});

// PATCH /api/seed-track/crops/:id/revert-stage - Admin: Revert to previous stage
router.patch('/:id/revert-stage', async (req, res) => {
  try {
    const crop = await prisma.registeredCrop.findUnique({
      where: { id: req.params.id },
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

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    if (!crop.guideline || !crop.guideline.stages || crop.guideline.stages.length === 0) {
      return res.status(400).json({ success: false, message: 'Crop has no guideline stages' });
    }

    const currentIndex = crop.currentStageIndex || 0;
    if (currentIndex <= 0) {
      return res.status(400).json({ success: false, message: 'Already at the first stage' });
    }

    const prevIndex = currentIndex - 1;
    const prevStage = crop.guideline.stages[prevIndex];

    // Delete all reports for stages >= the reverted stage (current and future)
    await prisma.stageReport.deleteMany({
      where: {
        cropId: req.params.id,
        stageIndex: {
          gte: prevIndex // Delete reports from previous stage onwards
        }
      }
    });

    const updated = await prisma.registeredCrop.update({
      where: { id: req.params.id },
      data: {
        currentStageIndex: prevIndex,
        currentStageName: prevStage.stageName,
      },
    });

    res.json({ 
      success: true, 
      data: updated, 
      message: `Stage reverted to: ${prevStage.stageName}. Reports for this stage and onwards have been deleted.` 
    });
  } catch (error) {
    console.error('[SeedTrack][Crops][REVERT_STAGE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to revert stage' });
  }
});

// DELETE /api/seed-track/crops/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await prisma.registeredCrop.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error('[SeedTrack][Crops][DELETE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Crop not found' });
    res.status(500).json({ success: false, message: 'Failed to delete crop' });
  }
});

export default router;
