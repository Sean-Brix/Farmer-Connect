import express from 'express';
import { cookieAuth } from '../../../Middlewares/Auth/cookieAuth.js';
import { adminAuth } from '../../../Middlewares/Auth/adminAuth.js';
import {
    createPlantingReport,
    getAllPlantingReports,
    getPlantingReportById,
    updatePlantingReport,
    deletePlantingReport,
    archivePlantingReport,
    getReportsByRSBSA,
    recalculateYield
} from '../../../Controller/PlantingReport/plantingReportController.js';
import {
    createPlantingSeason,
    getAllPlantingSeasons,
    getActiveSeasons,
    getPlantingSeasonById,
    updatePlantingSeason,
    deletePlantingSeason,
    deactivateSeason
} from '../../../Controller/PlantingReport/seasonController.js';
import {
    createSeedVariety,
    getAllSeedVarieties,
    getVarietiesByCropType,
    getSeedVarietyById,
    updateSeedVariety,
    deleteSeedVariety,
    deactivateVariety,
    getCropTypeStats
} from '../../../Controller/PlantingReport/varietyController.js';

const router = express.Router();

// Require authenticated admin for all planting report routes
router.use(cookieAuth, adminAuth);

// ==================== PLANTING REPORTS ====================

// CRUD Operations
router.post('/reports', createPlantingReport);
router.get('/reports', getAllPlantingReports);
router.get('/reports/:id', getPlantingReportById);
router.put('/reports/:id', updatePlantingReport);
router.delete('/reports/:id', deletePlantingReport);
router.patch('/reports/:id/archive', archivePlantingReport);

// Special endpoints
router.get('/reports/rsbsa/:rsbsaNumber', getReportsByRSBSA);
router.post('/reports/:id/calculate-yield', recalculateYield);

// ==================== PLANTING SEASONS ====================

// CRUD Operations
router.post('/seasons', createPlantingSeason);
router.get('/seasons', getAllPlantingSeasons);
router.get('/seasons/active', getActiveSeasons);
router.get('/seasons/:id', getPlantingSeasonById);
router.put('/seasons/:id', updatePlantingSeason);
router.delete('/seasons/:id', deletePlantingSeason);

// Utility
router.patch('/seasons/:id/deactivate', deactivateSeason);

// ==================== SEED VARIETIES ====================

// CRUD Operations
router.post('/varieties', createSeedVariety);
router.get('/varieties', getAllSeedVarieties);
router.get('/varieties/crop-type/:cropType', getVarietiesByCropType);
router.get('/varieties/stats', getCropTypeStats);
router.get('/varieties/:id', getSeedVarietyById);
router.put('/varieties/:id', updateSeedVariety);
router.delete('/varieties/:id', deleteSeedVariety);

// Utility
router.patch('/varieties/:id/deactivate', deactivateVariety);

export default router;
