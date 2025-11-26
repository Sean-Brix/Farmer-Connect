import prisma from '../../../config/database.js';
import express from 'express';
// PrismaClient import removed - using centralized db
import { isAuthenticated } from '../../../Utils/jwt_token.js';

// Using centralized prisma instance
const router = express.Router();

// GET /api/preferences/notifications - Get user notification preferences
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
            // Get user's notification preferences from database
            const preferences = await prisma.userPreference.findMany({
                where: {
                    userId: userId,
                    key: {
                        startsWith: 'notification_'
                    }
                }
            });
            
            // Transform to expected format
            const notificationSettings = {
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
            };
            
            // Update with saved preferences
            preferences.forEach(pref => {
                const [, type, setting] = pref.key.split('_');
                if (notificationSettings[type] && notificationSettings[type][setting] !== undefined) {
                    notificationSettings[type][setting] = pref.value === 'true';
                }
            });
            
            res.json({
                success: true,
                notifications: notificationSettings,
                message: 'Notification preferences retrieved successfully'
            });
            
        } catch (error) {
            console.error('Error getting notification preferences:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    })();
});

// POST /api/preferences/notifications - Set user notification preferences
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
            const { notifications } = req.body;
            
            // Validate notifications structure
            if (!notifications || typeof notifications !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid notification settings'
                });
            }
            
            // Save preferences
            const promises = [];
            
            Object.entries(notifications).forEach(([type, settings]) => {
                Object.entries(settings).forEach(([setting, value]) => {
                    const key = `notification_${type}_${setting}`;
                    promises.push(
                        prisma.userPreference.upsert({
                            where: {
                                userId_key: {
                                    userId: userId,
                                    key: key
                                }
                            },
                            update: {
                                value: value.toString(),
                                updatedAt: new Date()
                            },
                            create: {
                                userId: userId,
                                key: key,
                                value: value.toString()
                            }
                        })
                    );
                });
            });
            
            await Promise.all(promises);
            
            res.json({
                success: true,
                message: 'Notification settings updated successfully'
            });
            
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    })();
});

export default router;
