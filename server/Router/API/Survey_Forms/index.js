import express from 'express';

// Route: ('/api/survey-forms')
const router = express.Router();

import forms from './forms.js';
router.use('/forms', forms);

import responses from './responses.js';
router.use('/responses', responses);

import statistics from './statistics.js';
router.use('/statistics', statistics);

import analytics from './analytics.js';
router.use('/analytics', analytics);

export default router;
