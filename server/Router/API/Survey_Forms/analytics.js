import express from 'express';

// Route: ('/api/survey-forms/analytics')
const router = express.Router();

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

import super_admin from '../../../Middlewares/Auth/super_admin.js';

// GET analytics for a survey form
import { getSurveyAnalytics } from '../../../Controller/Survey_Forms/getSurveyAnalytics.js';
router.get('/:surveyFormId', super_admin, getSurveyAnalytics);

export default router;
