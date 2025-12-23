import express from 'express';

// Route: ('/api')
const router = express.Router();

import account from './Accounts/index.js';
router.use('/account', account);

import seminar from './Seminars/index.js';
router.use('/seminar', seminar);
router.use('/seminars', seminar); // Add plural alias for frontend compatibility

import inventory from './Inventory/index.js';
router.use('/inventory', inventory);

import eic from './EIC/index.js';
router.use('/eic', eic);

import distribution from './Distribution/index.js';
router.use('/dist', distribution);

import analytics from './Analytics/index.js';
router.use('/analytics', analytics);

import logs from './Logs/index.js';
router.use('/logs', logs);

import inquiry from './inquiry.js';
router.use('/inquiries', inquiry);

import faq from './faq.js';
router.use('/faq', faq);

import bot from './bot.js';
router.use('/bot', bot);

import surveyForms from './Survey_Forms/index.js';
router.use('/survey-forms', surveyForms);

import plantingReport from './PlantingReport/index.js';
router.use('/planting-reports', plantingReport);

import seedVariety from '../seedVariety.js';
router.use('/seed-varieties', seedVariety);

import cron from './cron.js';
router.use('/cron', cron);

import notification from './notification.js';
router.use('/notifications', notification);

import systemSettings from './systemSettings.js';
router.use('/system-settings', systemSettings);

import schedule from './schedule.js';
router.use('/schedule', schedule);

// Simple preferences endpoints (temporary)
router.get('/preferences/language', (req, res) => {
    res.json({
        success: true,
        language: 'en',
        message: 'Language preference retrieved successfully'
    });
});

router.post('/preferences/language', (req, res) => {
    res.json({
        success: true,
        language: req.body.language || 'en',
        message: 'Language preference saved successfully'
    });
});

router.get('/preferences/notifications', (req, res) => {
    res.json({
        success: true,
        notifications: {
            email: {
                seminar_updates: true,
                distribution_alerts: true,
                system_notifications: false,
            },
            push: {
                seminar_updates: true,
                distribution_alerts: true,
                system_notifications: true,
            },
            sms: {
                seminar_updates: false,
                distribution_alerts: true,
                system_notifications: false,
            },
        },
        message: 'Notification preferences retrieved successfully'
    });
});

router.post('/preferences/notifications', (req, res) => {
    res.json({
        success: true,
        message: 'Notification settings updated successfully'
    });
});

// Theme preferences endpoints
router.get('/preferences/theme', (req, res) => {
    res.json({
        success: true,
        theme: 'auto', // Default theme
        message: 'Theme preference retrieved successfully'
    });
});

router.post('/preferences/theme', (req, res) => {
    res.json({
        success: true,
        theme: req.body.theme || 'auto',
        message: 'Theme preference saved successfully'
    });
});

// Temporarily disabled preferences due to import issues
// import preferences from './Preferences/index.js';
// router.use('/preferences', preferences);

export default router;
