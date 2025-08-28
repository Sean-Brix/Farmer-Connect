import express from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../../../Utils/jwt_token.js';

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/preferences/language - Get user language preference
router.get('/', (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }

    (async () => {
        try {
            // Get user's language preference from database
            const userPreference = await prisma.userPreference.findFirst({
                where: {
                    userId: userId,
                    key: 'language'
                }
            });
            
            const language = userPreference?.value || 'en';
            
            res.json({
                success: true,
                language: language,
                message: 'Language preference retrieved successfully'
            });
            
        } catch (error) {
            console.error('Error getting language preference:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    })();
});

// POST /api/preferences/language - Set user language preference
router.post('/', (req, res) => {
    const userId = isAuthenticated(req);
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }

    (async () => {
        try {
            const { language } = req.body;
            
            // Validate language
            const supportedLanguages = ['en', 'tl'];
            if (!supportedLanguages.includes(language)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid language selection'
                });
            }
            
            // Save or update user preference
            await prisma.userPreference.upsert({
                where: {
                    userId_key: {
                        userId: userId,
                        key: 'language'
                    }
                },
                update: {
                    value: language,
                    updatedAt: new Date()
                },
                create: {
                    userId: userId,
                    key: 'language',
                    value: language
                }
            });
            
            res.json({
                success: true,
                language: language,
                message: 'Language preference saved successfully'
            });
            
        } catch (error) {
            console.error('Error saving language preference:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    })();
});

export default router;
