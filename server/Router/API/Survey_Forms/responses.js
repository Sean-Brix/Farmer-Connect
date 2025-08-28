import express from 'express';

// Route: ('/api/survey-forms/responses')
const router = express.Router();

// Authorization middleware for most routes
import parseToken from '../../../Middlewares/JWT/parseToken.js';
import authorize from '../../../Middlewares/Auth/authorize.js';

// POST submit survey response (can be anonymous or authenticated)
import { submitSurveyResponse } from '../../../Controller/Survey_Forms/submitSurveyResponse.js';
router.post('/:surveyFormId', (req, res, next) => {
    // Try to parse token if present, but don't require it
    parseToken(req, res, (err) => {
        if (err) {
            // If token parsing fails, continue without user
            req.user = null;
        }
        next();
    });
}, submitSurveyResponse);

// Apply authorization for admin routes
router.use(parseToken);
router.use(authorize);

import super_admin from '../../../Middlewares/Auth/super_admin.js';

// GET survey responses for a specific form
import { getSurveyResponses } from '../../../Controller/Survey_Forms/getSurveyResponses.js';
router.get('/:surveyFormId', super_admin, getSurveyResponses);

export default router;
