import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/seed-track/reports
router.get('/', async (req, res) => {
  try {
    const { cropId, userId, from, to } = req.query;

    const where = {};
    if (cropId) where.cropId = cropId;
    if (from || to) {
      where.reportDate = {};
      if (from) where.reportDate.gte = new Date(from);
      if (to) where.reportDate.lte = new Date(to);
    }

    const include = {};
    if (userId) {
      include.crop = { select: { id: true, userId: true, cropType: true, variety: true } };
    }

    let reports = await prisma.cropMonthlyReport.findMany({
      where,
      orderBy: { reportDate: 'desc' },
      include,
    });

    if (userId) {
      reports = reports.filter(r => r.crop.userId === userId);
    }

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error('[SeedTrack][Reports][LIST] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to list reports' });
  }
});

// GET /api/seed-track/reports/:id
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.cropMonthlyReport.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('[SeedTrack][Reports][GET] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get report' });
  }
});

// POST /api/seed-track/reports
router.post('/', async (req, res) => {
  try {
    const { cropId, reportDate, growthStage, plantHeight, healthStatus, estimatedYield, weatherImpact, notes, pestsObserved, diseasesObserved, fertilizersApplied, pesticideApplications, irrigationFrequency, soilCondition, majorActivities, challenges, plannedActions, actualYield, costs, weatherSnapshot } = req.body || {};
    if (!cropId || !reportDate || !growthStage) {
      return res.status(400).json({ success: false, message: 'cropId, reportDate, growthStage are required' });
    }

    const data = {
      cropId,
      reportDate: new Date(reportDate),
      growthStage,
      plantHeight: plantHeight != null ? Number(plantHeight) : null,
      healthStatus: healthStatus || null,
      estimatedYield: estimatedYield != null ? Number(estimatedYield) : null,
      weatherImpact: weatherImpact || null,
      notes: notes || null,
      pestsObserved: pestsObserved || null,
      diseasesObserved: diseasesObserved || null,
      fertilizersApplied: fertilizersApplied || null,
      pesticideApplications: pesticideApplications || null,
      irrigationFrequency: irrigationFrequency || null,
      soilCondition: soilCondition || null,
      majorActivities: majorActivities || null,
      challenges: challenges || null,
      plannedActions: plannedActions || null,
      actualYield: actualYield != null ? Number(actualYield) : null,
      costs: costs || null,
      weatherSnapshot: weatherSnapshot || null,
    };

    const created = await prisma.cropMonthlyReport.create({ data });

    // Optionally update crop stage
    if (growthStage) {
      await prisma.registeredCrop.update({
        where: { id: cropId },
        data: { currentStage: growthStage },
      }).catch(() => {});
    }

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('[SeedTrack][Reports][CREATE] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create report' });
  }
});

// PATCH /api/seed-track/reports/:id
router.patch('/:id', async (req, res) => {
  try {
    const updatable = ['reportDate','growthStage','plantHeight','healthStatus','estimatedYield','weatherImpact','notes','pestsObserved','diseasesObserved','fertilizersApplied','pesticideApplications','irrigationFrequency','soilCondition','majorActivities','challenges','plannedActions','actualYield','costs','weatherSnapshot'];
    const data = {};
    for (const key of updatable) {
      if (req.body[key] !== undefined) {
        if (key === 'reportDate') data[key] = req.body[key] ? new Date(req.body[key]) : null;
        else if (['plantHeight','estimatedYield','actualYield'].includes(key)) data[key] = req.body[key] != null ? Number(req.body[key]) : null;
        else data[key] = req.body[key];
      }
    }
    const updated = await prisma.cropMonthlyReport.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: updated });
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

export default router;
