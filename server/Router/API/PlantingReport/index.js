/**
 * PLANTING REPORT API ROUTES
 *
 * Updated for the three-state workflow (Request_Report → Planted → Completed),
 * archive/soft-delete support, and bulk operations.
 *
 * Notes:
 * - All routes require authenticated admin (cookieAuth + adminAuth).
 * - DELETE operations are soft deletes; restoration is available within 30 days.
 */

import express from 'express';
import { cookieAuth } from '../../../Middlewares/Auth/cookieAuth.js';
import { adminAuth } from '../../../Middlewares/Auth/adminAuth.js';
import {
    // CRUD operations
    createPlantingReport,
    getAllPlantingReports,
    getPlantingReportById,
    updatePlantingReport,
    deletePlantingReport,
    // State transitions
    transitionToPlanted,
    transitionToHarvested,
    // Archive management
    archiveReport,
    unarchiveReport,
    // Soft delete / restore
    restoreReport,
    getDeletedReports,
    // Bulk operations
    bulkArchiveReports,
    bulkDeleteReports,
    // Specials
    getReportsByRSBSA,
    recalculateYield,
    getPlantingReportSummary,
    getPlantingReportStatistics
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
    getActiveVarieties,
    getVarietiesByCropType,
    getSeedVarietyById,
    updateSeedVariety,
    deleteSeedVariety,
    deactivateVariety,
    getCropTypeStats,
    getReportsByVariety
} from '../../../Controller/PlantingReport/varietyController.js';

const router = express.Router();

// Require authenticated admin for all planting report routes
router.use(cookieAuth, adminAuth);

// ============================================================================
// PLANTING REPORTS
// ============================================================================

// CRUD Operations
router.post('/reports', createPlantingReport);
router.get('/reports/summary', getPlantingReportSummary);
router.get('/reports/statistics', getPlantingReportStatistics);
router.get('/reports/deleted', getDeletedReports);
router.get('/reports', getAllPlantingReports);
router.get('/reports/:id', getPlantingReportById);
router.put('/reports/:id', updatePlantingReport);
router.delete('/reports/:id', deletePlantingReport);

// State transitions
router.patch('/reports/:id/transition/planted', transitionToPlanted);
router.patch('/reports/:id/transition/harvested', transitionToHarvested);

// Archive management
router.patch('/reports/:id/archive', archiveReport);
router.patch('/reports/:id/unarchive', unarchiveReport);

// Soft delete / restore
router.patch('/reports/:id/restore', restoreReport);

// Bulk operations
router.post('/reports/bulk/archive', bulkArchiveReports);
router.post('/reports/bulk/delete', bulkDeleteReports);

// Special endpoints
router.get('/reports/rsbsa/:rsbsaNumber', getReportsByRSBSA);
router.post('/reports/:id/calculate-yield', recalculateYield);

// ============================================================================
// PLANTING SEASONS
// ============================================================================

router.post('/seasons', createPlantingSeason);
router.get('/seasons', getAllPlantingSeasons);
router.get('/seasons/active', getActiveSeasons);
router.get('/seasons/:id', getPlantingSeasonById);
router.put('/seasons/:id', updatePlantingSeason);
router.delete('/seasons/:id', deletePlantingSeason);
router.patch('/seasons/:id/deactivate', deactivateSeason);

// ============================================================================
// SEED VARIETIES
// ============================================================================

router.post('/varieties', createSeedVariety);
router.get('/varieties/active', getActiveVarieties);
router.get('/varieties/crop-type/:cropType', getVarietiesByCropType);
router.get('/varieties/stats', getCropTypeStats);
router.get('/varieties/:id/reports', getReportsByVariety);
router.get('/varieties/:id', getSeedVarietyById);
router.get('/varieties', getAllSeedVarieties);
router.put('/varieties/:id', updateSeedVariety);
router.delete('/varieties/:id', deleteSeedVariety);
router.patch('/varieties/:id/deactivate', deactivateVariety);

export default router;
