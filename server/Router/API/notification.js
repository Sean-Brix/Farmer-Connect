import express from 'express';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings
} from '../../Controller/Notification/notificationController.js';
import parseToken from '../../Middlewares/JWT/parseToken.js';

const router = express.Router();

// Apply authentication to all routes
router.use(parseToken);

// Notification routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadNotificationCount);
router.post('/read', markNotificationsAsRead);
router.post('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

// Notification settings routes
router.get('/settings', getNotificationSettings);
router.put('/settings', updateNotificationSettings);

export default router;
