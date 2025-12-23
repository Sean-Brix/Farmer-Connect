import express from 'express';
import getAllSeedVarieties from '../Controller/SeedVariety/getAll.js';
import getSeedVariety from '../Controller/SeedVariety/getOne.js';
import createSeedVariety from '../Controller/SeedVariety/create.js';
import updateSeedVariety from '../Controller/SeedVariety/update.js';
import deleteSeedVariety from '../Controller/SeedVariety/delete.js';

const router = express.Router();

// GET /api/seed-varieties - Get all seed varieties (with optional filters)
router.get('/', getAllSeedVarieties);

// GET /api/seed-varieties/:id - Get single seed variety
router.get('/:id', getSeedVariety);

// POST /api/seed-varieties - Create new seed variety
router.post('/', createSeedVariety);

// PUT /api/seed-varieties/:id - Update seed variety
router.put('/:id', updateSeedVariety);

// DELETE /api/seed-varieties/:id - Delete (or deactivate) seed variety
router.delete('/:id', deleteSeedVariety);

export default router;
