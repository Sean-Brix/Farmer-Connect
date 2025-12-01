import { PrismaClient } from '@prisma/client';
import { getUnreadCount, markAsRead } from '../../Services/notificationService.js';

const prisma = new PrismaClient();

/**
 * Get user's notifications (paginated)
 */
export const getNotifications = async (req, res) => {
  try {
    const { id: accountId } = req.user;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { accountId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          relatedId: true,
          read: true,
          createdAt: true
        }
      }),
      prisma.notification.count({ where: { accountId } })
    ]);

    return res.status(200).json({
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      error: 'Failed to fetch notifications',
      message: error.message
    });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const { id: accountId } = req.user;
    const count = await getUnreadCount(accountId);

    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return res.status(500).json({
      error: 'Failed to get unread count',
      message: error.message
    });
  }
};

/**
 * Mark notification(s) as read
 */
export const markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'notificationIds must be a non-empty array'
      });
    }

    await markAsRead(notificationIds);

    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return res.status(500).json({
      error: 'Failed to mark notifications as read',
      message: error.message
    });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const { id: accountId } = req.user;

    await prisma.notification.updateMany({
      where: { accountId, read: false },
      data: { read: true }
    });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return res.status(500).json({
      error: 'Failed to mark all as read',
      message: error.message
    });
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: accountId } = req.user;

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: { id, accountId }
    });

    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      });
    }

    await prisma.notification.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      error: 'Failed to delete notification',
      message: error.message
    });
  }
};

/**
 * Get user's notification settings
 */
export const getNotificationSettings = async (req, res) => {
  try {
    const { id: accountId } = req.user;

    let settings = await prisma.notificationSettings.findUnique({
      where: { accountId },
      select: {
        emailEnabled: true,
        requestApproved: true,
        requestRejected: true,
        itemDueSoon: true,
        itemOverdue: true,
        seminarReminder: true
      }
    });

    // Initialize if not exists
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          accountId,
          emailEnabled: true,
          requestApproved: true,
          requestRejected: true,
          itemDueSoon: true,
          itemOverdue: true,
          seminarReminder: true
        }
      });
    }

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return res.status(500).json({
      error: 'Failed to fetch settings',
      message: error.message
    });
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (req, res) => {
  try {
    const { id: accountId } = req.user;
    const {
      emailEnabled,
      requestApproved,
      requestRejected,
      itemDueSoon,
      itemOverdue,
      seminarReminder
    } = req.body;

    const settings = await prisma.notificationSettings.upsert({
      where: { accountId },
      update: {
        emailEnabled,
        requestApproved,
        requestRejected,
        itemDueSoon,
        itemOverdue,
        seminarReminder
      },
      create: {
        accountId,
        emailEnabled: emailEnabled ?? true,
        requestApproved: requestApproved ?? true,
        requestRejected: requestRejected ?? true,
        itemDueSoon: itemDueSoon ?? true,
        itemOverdue: itemOverdue ?? true,
        seminarReminder: seminarReminder ?? true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Notification settings updated',
      settings
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return res.status(500).json({
      error: 'Failed to update settings',
      message: error.message
    });
  }
};
