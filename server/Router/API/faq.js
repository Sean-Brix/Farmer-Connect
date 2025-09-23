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
import { 
    getFAQCategories as getCategories,
    getFAQCategory,
    createFAQCategory,
    updateFAQCategory,
    deleteFAQCategory,
    reorderFAQCategories
} from '../../Controller/FAQ/faqCategoryController.js';
import parseToken from '../../Middlewares/JWT/parseToken.js';
import authorize from '../../Middlewares/Auth/authorize.js';
import super_admin from '../../Middlewares/Auth/super_admin.js';

const router = express.Router();

// Public FAQ routes
router.get('/', getFAQs);
router.get('/categories', getFAQCategories);
router.put('/:id/view', incrementFAQView);
router.put('/:id/helpful', markFAQHelpful);

// Admin FAQ routes
router.get('/admin/all', parseToken, authorize, super_admin, getAllFAQsAdmin);
router.post('/admin/create', parseToken, authorize, super_admin, createFAQ);
router.put('/admin/:id', parseToken, authorize, super_admin, updateFAQ);
router.delete('/admin/:id', parseToken, authorize, super_admin, deleteFAQ);

// Admin FAQ Category routes
router.get('/admin/categories', parseToken, authorize, super_admin, getCategories);
router.get('/admin/categories/:id', parseToken, authorize, super_admin, getFAQCategory);
router.post('/admin/categories/create', parseToken, authorize, super_admin, createFAQCategory);
router.put('/admin/categories/:id', parseToken, authorize, super_admin, updateFAQCategory);
router.delete('/admin/categories/:id', parseToken, authorize, super_admin, deleteFAQCategory);
router.put('/admin/categories/reorder', parseToken, authorize, super_admin, reorderFAQCategories);

export default router;
