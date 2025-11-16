import express from 'express';
import { PrismaClient } from '@prisma/client';
import { canSubmitReportForStage, advanceToNextStage, getCurrentStageInfo } from '../../../Services/stageProgressionService.js';

const prisma = new PrismaClient();
const router = express.Router();

// Helper function to parse JSON string fields
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

// Helper function to stringify JSON fields for database storage
function stringifyReportJsonFields(data) {
  const stringified = { ...data };
  
  // Stringify costs if it's an object
  if (stringified.costs && typeof stringified.costs === 'object') {
    stringified.costs = JSON.stringify(stringified.costs);
  }
  
  // Stringify weatherSnapshot if it's an object
  if (stringified.weatherSnapshot && typeof stringified.weatherSnapshot === 'object') {
    stringified.weatherSnapshot = JSON.stringify(stringified.weatherSnapshot);
  }
  
  return stringified;
}

// GET /api/seed-track/reports
router.get('/', async (req, res) => {
  try {
    const { cropId, userId, from, to } = req.query;

    const where = {};
    if (cropId) where.cropId = cropId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const include = {
      feedback: {
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              access: true
            }
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  surname: true,
                  access: true
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        },
        where: { parentId: null },
        orderBy: { createdAt: 'desc' }
      }
    };
    
    if (userId) {
      include.crop = { select: { id: true, userId: true, cropType: true, variety: true } };
    }

    let reports = await prisma.cropMonthlyReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include,
    });

    if (userId) {
      reports = reports.filter(r => r.crop.userId === userId);
    }

    // Parse JSON fields before sending response
    const parsedReports = reports.map(parseReportJsonFields);

    res.json({ success: true, data: parsedReports });
  } catch (error) {
    console.error('[SeedTrack][Reports][LIST] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to list reports' });
  }
});

// GET /api/seed-track/reports/:id
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.cropMonthlyReport.findUnique({ 
      where: { id: req.params.id },
      include: {
        feedback: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                surname: true,
                access: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    firstName: true,
                    surname: true,
                    access: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          },
          where: { parentId: null },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    
    // Parse JSON fields before sending response
    const parsedReport = parseReportJsonFields(report);
    
    res.json({ success: true, data: parsedReport });
  } catch (error) {
    console.error('[SeedTrack][Reports][GET] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get report' });
  }
});

// POST /api/seed-track/reports
router.post('/', async (req, res) => {
  try {
    const { cropId, plantHeight, healthStatus, weatherImpact, notes, pestsObserved, diseasesObserved, fertilizersApplied, pesticideApplications, irrigationFrequency, soilCondition, plannedActions, actualYield, costs, weatherSnapshot } = req.body || {};
    if (!cropId) {
      return res.status(400).json({ success: false, message: 'cropId is required' });
    }

    // Get the crop with guideline to validate stage progression
    const crop = await prisma.registeredCrop.findUnique({
      where: { id: cropId },
      include: {
        guideline: {
          include: { stages: { orderBy: { stageNumber: 'asc' } } }
        }
      }
    });

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    // Validate if farmer can submit report for current stage
    const validation = await canSubmitReportForStage(crop);
    if (!validation.canSubmit) {
      return res.status(400).json({ 
        success: false, 
        message: validation.reason,
        daysRemaining: validation.daysRemaining,
        currentStage: crop.currentStageName,
        stageIndex: crop.currentStageIndex
      });
    }

    const data = {
      cropId,
      stageIndex: crop.currentStageIndex,
      stageName: crop.currentStageName,
      plantHeight: plantHeight != null ? Number(plantHeight) : null,
      healthStatus: healthStatus || null,
      weatherImpact: weatherImpact || null,
      notes: notes || null,
      pestsObserved: pestsObserved || null,
      diseasesObserved: diseasesObserved || null,
      fertilizersApplied: fertilizersApplied || null,
      pesticideApplications: pesticideApplications || null,
      irrigationFrequency: irrigationFrequency || null,
      soilCondition: soilCondition || null,
      plannedActions: plannedActions || null,
      actualYield: actualYield != null ? Number(actualYield) : null,
      costs: costs || null,
      weatherSnapshot: weatherSnapshot || null,
    };

    // Stringify JSON fields for database storage
    const stringifiedData = stringifyReportJsonFields(data);

    const created = await prisma.cropMonthlyReport.create({ data: stringifiedData });

    // Advance to next stage after successful report submission
    const updatedCrop = await advanceToNextStage(crop);

    // Get updated stage info
    const stageInfo = await getCurrentStageInfo(updatedCrop);

    // Parse JSON fields back for response
    const parsedCreated = parseReportJsonFields(created);

    res.status(201).json({ 
      success: true, 
      data: parsedCreated,
      stageInfo: stageInfo,
      message: stageInfo.isCompleted 
        ? 'Report submitted successfully! All stages completed.' 
        : `Report submitted successfully! Advanced to stage ${stageInfo.currentStageIndex + 1}/${stageInfo.totalStages}: ${stageInfo.currentStageName}`
    });
  } catch (error) {
    console.error('[SeedTrack][Reports][CREATE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create report' });
  }
});

// PATCH /api/seed-track/reports/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatable = ['plantHeight','healthStatus','weatherImpact','notes','pestsObserved','diseasesObserved','fertilizersApplied','pesticideApplications','irrigationFrequency','soilCondition','plannedActions','actualYield','costs','weatherSnapshot'];
    const data = {};
    for (const key of updatable) {
      if (req.body[key] !== undefined) {
        if (['plantHeight','actualYield'].includes(key)) data[key] = req.body[key] != null ? Number(req.body[key]) : null;
        else data[key] = req.body[key];
      }
    }
    
    // Stringify JSON fields for database storage
    const stringifiedData = stringifyReportJsonFields(data);
    
    const updated = await prisma.cropMonthlyReport.update({ where: { id: req.params.id }, data: stringifiedData });
    
    // Parse JSON fields back for response
    const parsedUpdated = parseReportJsonFields(updated);
    
    res.json({ success: true, data: parsedUpdated });
  } catch (error) {
    console.error('[SeedTrack][Reports][UPDATE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(500).json({ success: false, message: 'Failed to update report' });
  }
});

// DELETE /api/seed-track/reports/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await prisma.cropMonthlyReport.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error('[SeedTrack][Reports][DELETE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
});

// POST /api/seed-track/reports/:reportId/feedback
router.post('/:reportId/feedback', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { authorId, message, parentId } = req.body;

    if (!authorId || !message) {
      return res.status(400).json({ success: false, message: 'authorId and message are required' });
    }

    // Verify report exists
    const report = await prisma.cropMonthlyReport.findUnique({ where: { id: reportId } });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Verify parent feedback exists if parentId is provided
    if (parentId) {
      const parentFeedback = await prisma.reportFeedback.findUnique({ where: { id: parentId } });
      if (!parentFeedback || parentFeedback.reportId !== reportId) {
        return res.status(404).json({ success: false, message: 'Parent feedback not found or does not belong to this report' });
      }
    }

    const feedback = await prisma.reportFeedback.create({
      data: {
        reportId,
        authorId,
        message,
        parentId: parentId || null
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            access: true
          }
        }
      }
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error('[SeedTrack][Reports][Feedback][CREATE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create feedback' });
  }
});

// GET /api/seed-track/reports/:reportId/feedback
router.get('/:reportId/feedback', async (req, res) => {
  try {
    const { reportId } = req.params;

    const feedback = await prisma.reportFeedback.findMany({
      where: { 
        reportId,
        parentId: null
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            access: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                surname: true,
                access: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('[SeedTrack][Reports][Feedback][LIST] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to list feedback' });
  }
});

// DELETE /api/seed-track/reports/:reportId/feedback/:feedbackId
router.delete('/:reportId/feedback/:feedbackId', async (req, res) => {
  try {
    const { reportId, feedbackId } = req.params;

    // Verify feedback belongs to this report
    const feedback = await prisma.reportFeedback.findUnique({ where: { id: feedbackId } });
    if (!feedback || feedback.reportId !== reportId) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    await prisma.reportFeedback.delete({ where: { id: feedbackId } });

    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('[SeedTrack][Reports][Feedback][DELETE] Error:', error);
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Feedback not found' });
    res.status(500).json({ success: false, message: 'Failed to delete feedback' });
  }
});

// DELETE /api/seed-track/reports/:id - Admin: Delete a report
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Note: In production, add proper admin authentication
    // For now, trusting the frontend to only call this from admin panel

    const deleted = await prisma.cropReport.delete({ 
      where: { id } 
    });

    res.json({ 
      success: true, 
      data: deleted, 
      message: 'Report deleted successfully' 
    });
  } catch (error) {
    console.error('[SeedTrack][Reports][DELETE] Error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
});

export default router;
