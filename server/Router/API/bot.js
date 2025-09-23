import express from 'express';
import botService from '../../Services/botService.js';

const router = express.Router();

/**
 * GET /api/bot/welcome
 * Get bot welcome message with FAQ categories
 */
router.get('/welcome', async (req, res) => {
    try {
        const response = await botService.getWelcomeMessage();
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Bot welcome error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get welcome message',
            data: {
                type: 'bot_error',
                message: "I'm having trouble starting up. Let me connect you with a live agent.",
                escalate: true,
                timestamp: new Date()
            }
        });
    }
});

/**
 * GET /api/bot/category/:categoryId
 * Get FAQs for a specific category
 */
router.get('/category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const response = await botService.getFAQsForCategory(categoryId);
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Bot category error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get category FAQs',
            data: {
                type: 'bot_error',
                message: "I'm having trouble loading that information. Let me connect you with a live agent.",
                escalate: true,
                timestamp: new Date()
            }
        });
    }
});

/**
 * POST /api/bot/escalate
 * User requests to escalate to live agent
 */
router.post('/escalate', async (req, res) => {
    try {
        const response = botService.getEscalationMessage();
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Bot escalation error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to escalate',
            data: {
                type: 'bot_error',
                message: "Let me connect you with a live agent.",
                escalate: true,
                timestamp: new Date()
            }
        });
    }
});

/**
 * POST /api/bot/faq-not-helpful
 * User indicates FAQ wasn't helpful
 */
router.post('/faq-not-helpful', async (req, res) => {
    try {
        const response = botService.getFAQNotHelpfulMessage();
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Bot FAQ not helpful error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process feedback',
            data: {
                type: 'bot_error',
                message: "Let me connect you with a live agent who can help you better.",
                escalate: true,
                timestamp: new Date()
            }
        });
    }
});

/**
 * POST /api/bot/faq/:faqId/view
 * Track FAQ view
 */
router.post('/faq/:faqId/view', async (req, res) => {
    try {
        const { faqId } = req.params;
        await botService.incrementFAQView(faqId);
        res.json({ success: true });
    } catch (error) {
        console.error('Bot FAQ view error:', error);
        res.json({ success: false, error: 'Failed to track view' });
    }
});

/**
 * POST /api/bot/faq/:faqId/helpful
 * Mark FAQ as helpful
 */
router.post('/faq/:faqId/helpful', async (req, res) => {
    try {
        const { faqId } = req.params;
        const result = await botService.markFAQHelpful(faqId);
        res.json({ success: result.success, error: result.error });
    } catch (error) {
        console.error('Bot FAQ helpful error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark as helpful' });
    }
});

/**
 * POST /api/bot/should-escalate
 * Check if user message should trigger immediate escalation
 */
router.post('/should-escalate', async (req, res) => {
    try {
        const { message } = req.body;
        const shouldEscalate = botService.shouldEscalateImmediately(message);
        
        if (shouldEscalate) {
            const response = botService.getEscalationMessage();
            res.json({ success: true, escalate: true, data: response });
        } else {
            const response = await botService.getWelcomeMessage();
            res.json({ success: true, escalate: false, data: response });
        }
    } catch (error) {
        console.error('Bot escalation check error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process message',
            escalate: true,
            data: {
                type: 'bot_error',
                message: "Let me connect you with a live agent.",
                escalate: true,
                timestamp: new Date()
            }
        });
    }
});

export default router;