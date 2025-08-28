import express from 'express';

// Route: ('/api/survey-forms/forms')
const router = express.Router();

// Public routes (for submitting responses)
import { getSurveyFormById } from '../../../Controller/Survey_Forms/getSurveyFormById.js';
router.get('/:id/public', getSurveyFormById); // Public access to form structure

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

// Admin routes
import super_admin from '../../../Middlewares/Auth/super_admin.js';

// GET all survey forms (with filtering, search, pagination)
import { getAllSurveyForms } from '../../../Controller/Survey_Forms/getAllSurveyForms.js';
router.get('/', super_admin, getAllSurveyForms);

// GET single survey form by ID
router.get('/:id', super_admin, getSurveyFormById);

// POST create new survey form
import { createSurveyForm } from '../../../Controller/Survey_Forms/createSurveyForm.js';
router.post('/', super_admin, createSurveyForm);

// PUT update survey form
import { updateSurveyForm } from '../../../Controller/Survey_Forms/updateSurveyForm.js';
router.put('/:id', super_admin, updateSurveyForm);

// DELETE survey form
import { deleteSurveyForm } from '../../../Controller/Survey_Forms/deleteSurveyForm.js';
router.delete('/:id', super_admin, deleteSurveyForm);

export default router;
