import { PrismaClient } from '@prisma/client';
import { sendMail } from './emailService.js';

const prisma = new PrismaClient();

/**
 * Lightweight notification service - optimized for performance
 * Notifications are created in-app only by default
 * Email sending is optional and batched to avoid resource strain
 */

/**
 * Create an in-app notification
 * Fast operation - just inserts into database
 */
export async function createNotification({ accountId, type, title, message, relatedId = null }) {
  try {
    const notification = await prisma.notification.create({
      data: {
        accountId,
        type,
        title,
        message,
        relatedId
      }
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Send email notification (optional, only if user has email enabled)
 * This is kept separate to avoid blocking the notification creation
 */
export async function sendEmailIfEnabled(accountId, { subject, message }) {
  try {
    // Check user's notification settings
    const settings = await prisma.notificationSettings.findUnique({
      where: { accountId },
      select: { emailEnabled: true }
    });

    if (!settings?.emailEnabled) {
      return { sent: false, reason: 'Email disabled by user' };
    }

    // Get user email
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { email: true, firstName: true }
    });

    if (!account?.email) {
      return { sent: false, reason: 'No email address' };
    }

    // Send email asynchronously (non-blocking)
    sendMail({
      to: account.email,
      subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #16a34a;">Farmer Connect</h2>
        <p>Hi ${account.firstName},</p>
        <p>${message}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">This is an automated notification from Farmer Connect.</p>
      </div>`
    }).catch(err => console.error('Email send error (non-blocking):', err));

    return { sent: true };
  } catch (error) {
    console.error('Error in sendEmailIfEnabled:', error);
    return { sent: false, reason: error.message };
  }
}

/**
 * Notify user about request status change
 */
export async function notifyRequestStatus(accountId, { itemName, status, transactionId }) {
  const messages = {
    Approved: {
      title: 'Request Approved',
      message: `Your request for "${itemName}" has been approved! You can now pick up the item.`,
      type: 'REQUEST_APPROVED'
    },
    Rejected: {
      title: 'Request Rejected',
      message: `Your request for "${itemName}" has been rejected. Please contact admin for details.`,
      type: 'REQUEST_REJECTED'
    },
    Borrowed: {
      title: 'Item Picked Up',
      message: `You have successfully picked up "${itemName}". Please return it on time.`,
      type: 'ITEM_BORROWED'
    },
    late_pickup: {
      title: 'Item Picked Up (Late)',
      message: `You picked up "${itemName}" late. Your return date has been adjusted accordingly. Please return on time.`,
      type: 'ITEM_LATE_PICKUP'
    },
    Returned: {
      title: 'Item Returned',
      message: `Thank you for returning "${itemName}" on time. Your borrowing history has been recorded.`,
      type: 'ITEM_RETURNED'
    },
    late_return: {
      title: 'Late Return Recorded',
      message: `"${itemName}" was returned past the due date. Please be mindful of return dates in future requests.`,
      type: 'ITEM_LATE_RETURN'
    },
    No_Return: {
      title: 'Item Not Returned',
      message: `"${itemName}" has not been returned. Please contact the admin immediately to resolve this issue.`,
      type: 'ITEM_NO_RETURN'
    },
    No_Pickup: {
      title: 'Pickup Missed',
      message: `You did not pick up "${itemName}" on the scheduled date. The request has been closed.`,
      type: 'ITEM_NO_PICKUP'
    }
  };

  const config = messages[status];
  if (!config) return null;

  // TEST 8.1-8.6: Notification System
  const testNum = {
    'Borrowed': '8.1',
    'late_pickup': '8.2',
    'Returned': '8.3',
    'late_return': '8.4',
    'No_Return': '8.5',
    'No_Pickup': '8.6'
  }[status];

  if (testNum) {
    console.log(`
${'='.repeat(60)}
📋 TEST ${testNum}: NOTIFICATION - ${status.toUpperCase()}
${'='.repeat(60)}
Account ID: ${accountId}
Item name: ${itemName}
Transaction ID: ${transactionId}
Notification type: ${config.type}
Title: ${config.title}
Message: ${config.message}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST ${testNum}
${'='.repeat(60)}
`);
  }

  // Create in-app notification (fast)
  const notification = await createNotification({
    accountId,
    type: config.type,
    title: config.title,
    message: config.message,
    relatedId: transactionId
  });

  // Send email if enabled (non-blocking)
  sendEmailIfEnabled(accountId, {
    subject: config.title,
    message: config.message
  });

  return notification;
}

/**
 * Notify user about items due soon (called by cron job)
 */
export async function notifyItemDueSoon(accountId, { itemName, daysUntilDue, transactionId }) {
  const notification = await createNotification({
    accountId,
    type: 'ITEM_DUE_SOON',
    title: 'Item Due Soon',
    message: `Reminder: "${itemName}" is due for return in ${daysUntilDue} day(s). Please return it on time.`,
    relatedId: transactionId
  });

  // Check user settings for due soon notifications
  const settings = await prisma.notificationSettings.findUnique({
    where: { accountId },
    select: { itemDueSoon: true }
  });

  if (settings?.itemDueSoon) {
    sendEmailIfEnabled(accountId, {
      subject: 'Item Due Soon - Farmer Connect',
      message: `Reminder: "${itemName}" is due for return in ${daysUntilDue} day(s). Please return it on time to avoid late fees.`
    });
  }

  return notification;
}

/**
 * Notify user about overdue items
 */
export async function notifyItemOverdue(accountId, { itemName, daysOverdue, transactionId }) {
  const notification = await createNotification({
    accountId,
    type: 'ITEM_OVERDUE',
    title: 'Item Overdue',
    message: `URGENT: "${itemName}" is ${daysOverdue} day(s) overdue. Please return it immediately.`,
    relatedId: transactionId
  });

  // Check user settings for overdue notifications
  const settings = await prisma.notificationSettings.findUnique({
    where: { accountId },
    select: { itemOverdue: true }
  });

  if (settings?.itemOverdue) {
    sendEmailIfEnabled(accountId, {
      subject: '⚠️ Item Overdue - Farmer Connect',
      message: `URGENT: "${itemName}" is ${daysOverdue} day(s) overdue. Please return it immediately to avoid penalties.`
    });
  }

  return notification;
}

/**
 * Get user's unread notification count (fast query)
 */
export async function getUnreadCount(accountId) {
  return await prisma.notification.count({
    where: { accountId, read: false }
  });
}

/**
 * Mark notifications as read (bulk operation)
 */
export async function markAsRead(notificationIds) {
  return await prisma.notification.updateMany({
    where: { id: { in: notificationIds } },
    data: { read: true }
  });
}

/**
 * Initialize notification settings for new users
 */
export async function initializeNotificationSettings(accountId) {
  try {
    return await prisma.notificationSettings.create({
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
  } catch (error) {
    // Settings might already exist
    console.error('Error initializing notification settings:', error);
    return null;
  }
}
