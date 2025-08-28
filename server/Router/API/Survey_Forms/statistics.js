import express from 'express';

// Route: ('/api/survey-forms/statistics')
const router = express.Router();

// Authorization middleware
import parseToken from '../../../Middlewares/JWT/parseToken.js';
router.use(parseToken);

import authorize from '../../../Middlewares/Auth/authorize.js';
router.use(authorize);

import super_admin from '../../../Middlewares/Auth/super_admin.js';

// GET statistics for a survey form
import { getSurveyStatistics } from '../../../Controller/Survey_Forms/getSurveyStatistics.js';
router.get('/:surveyFormId', super_admin, getSurveyStatistics);

// POST create new statistic
import { createSurveyStatistic } from '../../../Controller/Survey_Forms/createSurveyStatistic.js';
router.post('/:surveyFormId', super_admin, createSurveyStatistic);

// PUT update statistic
import { updateSurveyStatistic } from '../../../Controller/Survey_Forms/updateSurveyStatistic.js';
router.put('/:statisticId', super_admin, updateSurveyStatistic);

// DELETE statistic
import { deleteSurveyStatistic } from '../../../Controller/Survey_Forms/deleteSurveyStatistic.js';
router.delete('/:statisticId', super_admin, deleteSurveyStatistic);

export default router;
