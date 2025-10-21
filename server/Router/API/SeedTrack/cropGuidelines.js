import express from 'express';
import {
  getAllGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline
} from '../../../Controller/SeedTrack/cropGuidelines.js';

const router = express.Router();

// Get all crop guidelines
router.get('/', getAllGuidelines);

// Get a single crop guideline by ID
router.get('/:id', getGuidelineById);

// Create a new crop guideline
router.post('/', createGuideline);

// Update a crop guideline
router.patch('/:id', updateGuideline);

// Delete a crop guideline
router.delete('/:id', deleteGuideline);

export default router;
