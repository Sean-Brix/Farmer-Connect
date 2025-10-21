import express from 'express';
import { PrismaClient } from '@prisma/client';

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
      include: { reports: includeReports === 'true' },
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
      include: { reports: true },
    });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    
    // Parse JSON fields in reports
    if (crop.reports && Array.isArray(crop.reports)) {
      crop.reports = crop.reports.map(parseReportJsonFields);
    }
    
    res.json({ success: true, data: crop });
  } catch (error) {
    console.error('[SeedTrack][Crops][GET] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get crop' });
  }
});

// POST /api/seed-track/crops
router.post('/', async (req, res) => {
  try {
    const { userId, cropType, variety, plantingDate, expectedHarvest, area, expectedYield, currentStage, notes } = req.body || {};
    if (!userId || !cropType || !variety || !plantingDate) {
      return res.status(400).json({ success: false, message: 'userId, cropType, variety, plantingDate are required' });
    }
    const data = {
      userId,
      cropType,
      variety,
      plantingDate: new Date(plantingDate),
      expectedHarvest: expectedHarvest ? new Date(expectedHarvest) : null,
      area: area != null ? Number(area) : null,
      expectedYield: expectedYield != null ? Number(expectedYield) : null,
      currentStage: currentStage || 'Seedling',
      notes: notes || null,
    };
    const created = await prisma.registeredCrop.create({ data });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('[SeedTrack][Crops][CREATE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create crop' });
  }
});

// PATCH /api/seed-track/crops/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatable = ['cropType', 'variety', 'plantingDate', 'expectedHarvest', 'area', 'expectedYield', 'status', 'currentStage', 'notes'];
    const data = {};
    for (const key of updatable) {
      if (req.body[key] !== undefined) {
        if (['plantingDate', 'expectedHarvest'].includes(key)) data[key] = req.body[key] ? new Date(req.body[key]) : null;
        else if (['area', 'expectedYield'].includes(key)) data[key] = req.body[key] != null ? Number(req.body[key]) : null;
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
