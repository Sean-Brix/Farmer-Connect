import express from 'express';
import { 
    getFAQs, 
    getFAQCategories, 
    incrementFAQView, 
    markFAQHelpful,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    getAllFAQsAdmin
} from '../../Controller/FAQ/faqController.js';
import { verifyAccessToken } from '../../Middlewares/JWT/verifyAccessToken.js';
import { adminAuth } from '../../Middlewares/Auth/adminAuth.js';

const router = express.Router();

// Public FAQ routes
router.get('/', getFAQs);
router.get('/categories', getFAQCategories);
router.put('/:id/view', incrementFAQView);
router.put('/:id/helpful', markFAQHelpful);

// Admin FAQ routes
router.get('/admin/all', verifyAccessToken, adminAuth, getAllFAQsAdmin);
router.post('/admin/create', verifyAccessToken, adminAuth, createFAQ);
router.put('/admin/:id', verifyAccessToken, adminAuth, updateFAQ);
router.delete('/admin/:id', verifyAccessToken, adminAuth, deleteFAQ);

export default router;
