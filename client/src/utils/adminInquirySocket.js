/**
 * Admin-side socket integration for inquiry system
 * This file provides helper functions for admin chat management
 */

import { socket } from './socket.js';
import socketLogoutHelper from './socketLogoutHelper.js';

// Socket event constants for admin
export const ADMIN_EVENTS = {
    INQUIRIES_LIST: 'admin_inquiry:inquiries_list',
    INQUIRY_ASSIGNED: 'admin_inquiry:assigned',
    NEW_INQUIRY: 'admin_inquiry:new_inquiry',
    MESSAGE_SENT: 'admin_inquiry:message_sent',
    STATUS_UPDATED: 'admin_inquiry:status_updated',
    PRIORITY_UPDATED: 'admin_inquiry:priority_updated',
    CONVERSATION: 'admin_inquiry:conversation',
    ERROR: 'admin_inquiry:error',
    CONNECTED: 'admin_inquiry:connected',
    USER_LOGOUT: 'user:logout'
};

export const ADMIN_ACTIONS = {
    GET_INQUIRIES: 'admin_inquiry:get_inquiries',
    ASSIGN_INQUIRY: 'admin_inquiry:assign_inquiry',
    SEND_REPLY: 'admin_inquiry:send_reply',
    UPDATE_STATUS: 'admin_inquiry:update_status',
    UPDATE_PRIORITY: 'admin_inquiry:update_priority',
    GET_CONVERSATION: 'admin_inquiry:get_conversation',
    GET_ANALYTICS: 'admin_inquiry:get_analytics'
};

/**
 * Initialize admin socket connection for inquiry system
 * @param {Object} callbacks - Event callback functions
 */
export function initializeAdminInquirySocket(callbacks = {}) {
    // Clean up any existing listeners first
    removeAdminInquirySocketListeners();
    
    // Connection events
    socket.on(ADMIN_EVENTS.CONNECTED, (data) => {
        callbacks.onConnected?.(data);
    });

    // Also listen for socket.io 'connect' event in case ADMIN_EVENTS.CONNECTED is missed
    socket.on('connect', () => {
        callbacks.onConnected?.({ 
            message: 'Connected via socket.io connect event',
            fromConnect: true 
        });
    });

    // If socket is already connected, manually trigger onConnected
    if (socket?.connected) {
        setTimeout(() => {
            callbacks.onConnected?.({ 
                message: 'Already connected to admin inquiry system',
                manual: true 
            });
        }, 100);
    }

    // Inquiry events
    socket.on(ADMIN_EVENTS.INQUIRIES_LIST, (inquiries) => {
        callbacks.onInquiriesList?.(inquiries);
    });

    socket.on(ADMIN_EVENTS.NEW_INQUIRY, (data) => {
        callbacks.onNewInquiry?.(data);
    });

    socket.on('admin_inquiry:new_message', (data) => {
        callbacks.onNewMessage?.(data);
    });

    socket.on('admin_inquiry:message_update', (data) => {
        console.log('🔵 ADMIN RECEIVED MESSAGE_UPDATE:', {
            success: data.success,
            inquiryId: data.inquiryId,
            replyId: data.reply?.id,
            statusChanged: data.statusChanged,
            assignmentChanged: data.assignmentChanged,
            timestamp: new Date().toISOString()
        });
        
        // Call the correct callback name that the UI expects
        callbacks.onNewMessage?.(data);
        
        if (data.statusChanged) {
            console.log('🔄 STATUS CHANGE DETECTED:', data.inquiry?.status);
            // Transform the data to match what onStatusUpdated expects
            const statusUpdateData = {
                success: data.success,
                inquiryId: data.inquiryId,
                status: data.inquiry?.status?.toLowerCase() || 'unknown',
                previousStatus: data.previousStatus || 'unknown',
                updatedBy: data.updatedBy
            };
            console.log('📤 CALLING onStatusUpdated with transformed data:', statusUpdateData);
            callbacks.onStatusUpdated?.(statusUpdateData);
        }
        if (data.assignmentChanged) {
            console.log('👤 ASSIGNMENT CHANGE DETECTED:', data.inquiry?.assignedTo);
            callbacks.onAssignmentUpdated?.(data);
        }
    });

    socket.on(ADMIN_EVENTS.INQUIRY_ASSIGNED, (data) => {
        callbacks.onInquiryAssigned?.(data);
    });

    socket.on(ADMIN_EVENTS.CONVERSATION, (data) => {
        callbacks.onConversation?.(data);
    });

    socket.on(ADMIN_EVENTS.MESSAGE_SENT, (data) => {
        callbacks.onMessageSent?.(data);
    });

    socket.on(ADMIN_EVENTS.STATUS_UPDATED, (data) => {
        callbacks.onStatusUpdated?.(data);
    });

    socket.on(ADMIN_EVENTS.PRIORITY_UPDATED, (data) => {
        callbacks.onPriorityUpdated?.(data);
    });

    socket.on(ADMIN_EVENTS.USER_LOGOUT, (data) => {
        callbacks.onUserLogout?.(data);
    });

    socket.on(ADMIN_EVENTS.ERROR, (error) => {
        console.error('Admin socket error:', error);
        callbacks.onError?.(error);
    });

    // Connection management
    socket.on('connect', () => {
        callbacks.onConnect?.();
    });

    socket.on('disconnect', () => {
        callbacks.onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
        console.error('Admin connection error:', error);
        callbacks.onConnectionError?.(error);
    });
}

/**
 * Connect admin socket with role
 * @param {string} role - Admin role (Admin, Super_Admin)
 */
export function connectAdminInquirySocket(role = 'Admin') {
    socket.auth = { role };
    if (!socket.connected) {
        socket.connect();
    }
    
    // Register socket with logout helper
    socketLogoutHelper.setSocket(socket);
}

/**
 * Disconnect admin socket
 */
export function disconnectAdminInquirySocket() {
    socket.disconnect();
}

/**
 * Get all inquiries (filtered by status if needed)
 * @param {Object} filters - Filter options
 */
export function getAllInquiries(filters = {}) {
    if (!socket?.connected) {
        console.error('Socket not connected, cannot request inquiries');
        return;
    }
    
    socket.emit(ADMIN_ACTIONS.GET_INQUIRIES, filters);
}

/**
 * Assign inquiry to admin
 * @param {Object} data - Assignment data
 * @param {string} data.inquiryId - Inquiry ID
 * @param {string} [data.adminId] - Admin ID (optional, defaults to current admin)
 */
export function assignInquiry(data) {
    socket.emit(ADMIN_ACTIONS.ASSIGN_INQUIRY, data);
}

/**
 * Send reply to inquiry
 * @param {Object} data - Reply data
 * @param {string} data.inquiryId - Inquiry ID
 * @param {string} data.message - Reply message
 */
export function sendAdminReply(data) {
    console.log('🔵 ADMIN SENDING REPLY:', {
        inquiryId: data.inquiryId,
        messageLength: data.message?.length,
        timestamp: new Date().toISOString()
    });
    socket.emit(ADMIN_ACTIONS.SEND_REPLY, data);
}

/**
 * Update inquiry status
 * @param {Object} data - Status update data
 * @param {string} data.inquiryId - Inquiry ID
 * @param {string} data.status - New status (pending, in-progress, resolved, closed)
 */
export function updateInquiryStatus(data) {
    socket.emit(ADMIN_ACTIONS.UPDATE_STATUS, data);
}

/**
 * Update inquiry priority
 * @param {Object} data - Priority update data
 * @param {string} data.inquiryId - Inquiry ID
 * @param {string} data.priority - New priority (low, medium, high, urgent)
 */
export function updateInquiryPriority(data) {
    socket.emit(ADMIN_ACTIONS.UPDATE_PRIORITY, data);
}

/**
 * Get conversation for specific inquiry
 * @param {string} inquiryId - Inquiry ID
 */
export function getAdminConversation(inquiryId) {
    socket.emit(ADMIN_ACTIONS.GET_CONVERSATION, { inquiryId });
}

/**
 * Get inquiry analytics
 */
export function getInquiryAnalytics() {
    socket.emit(ADMIN_ACTIONS.GET_ANALYTICS);
}

/**
 * Logout with socket disconnection (admin version)
 * @param {function} logoutApiCall - Function that calls the logout API
 * @returns {Promise<boolean>} Success status
 */
export async function adminLogoutWithSocket(logoutApiCall) {
    return await socketLogoutHelper.logoutWithSocket(logoutApiCall);
}

/**
 * Helper function to format inquiry for admin UI display
 * @param {Object} inquiry - Raw inquiry data from server
 * @returns {Object} Formatted inquiry data
 */
export function formatInquiryForAdminUI(inquiry) {
    // Debug logging to identify problematic data
    if (!inquiry) {
        console.error('formatInquiryForAdminUI: inquiry is null/undefined');
        throw new Error('Inquiry data is null or undefined');
    }
    
    if (!inquiry.id) {
        console.error('formatInquiryForAdminUI: inquiry missing ID', inquiry);
        throw new Error('Inquiry missing required ID field');
    }

    // Log status conversion for in-progress issue debugging
    const originalStatus = inquiry.status;
    const convertedStatus = inquiry.status ? inquiry.status.toLowerCase().replace(/_/g, '-') : 'pending';
    
    if (originalStatus === 'IN_PROGRESS' || convertedStatus === 'in-progress') {
        console.log('🔄 [STATUS CONVERSION] In-progress inquiry detected:', {
            inquiryId: inquiry.id,
            originalStatus,
            convertedStatus,
            hasReplies: !!(inquiry.replies && inquiry.replies.length > 0),
            repliesCount: inquiry.replies?.length || 0
        });
    }
    
    try {
        return {
            id: inquiry.id,
            user: inquiry.user ? `${inquiry.user.firstName || ''} ${inquiry.user.surname || ''}`.trim() : 'Unknown User',
            email: inquiry.user?.email || 'No email',
            subject: inquiry.subject || 'No subject',
            message: inquiry.message || 'No message',
            status: convertedStatus,
            priority: inquiry.priority ? inquiry.priority.toLowerCase() : 'medium',
            category: inquiry.category || 'General',
            date: inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : new Date().toLocaleString(),
            lastUpdate: inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleString() : new Date().toLocaleString(),
            assignedTo: inquiry.assignedTo ? `${inquiry.assignedTo.firstName || ''} ${inquiry.assignedTo.surname || ''}`.trim() : null,
            resolvedBy: inquiry.resolvedBy ? `${inquiry.resolvedBy.firstName || ''} ${inquiry.resolvedBy.surname || ''}`.trim() : null,
            resolvedDate: inquiry.resolvedAt ? new Date(inquiry.resolvedAt).toLocaleString() : null,
            replies: inquiry.replies?.map(reply => ({
                id: reply.id,
                sender: reply.senderType ? reply.senderType.toLowerCase() : 'unknown',
                senderName: reply.senderName || 'Unknown',
                message: reply.message || '',
                timestamp: reply.createdAt ? new Date(reply.createdAt).toLocaleString() : new Date().toLocaleString()
            })) || []
        };
    } catch (error) {
        console.error('Error formatting inquiry for admin UI:', error, inquiry);
        // Return a safe default object
        return {
            id: inquiry?.id || 'unknown',
            user: 'Unknown User',
            email: 'No email',
            subject: 'Error loading subject',
            message: 'Error loading message',
            status: 'pending',
            priority: 'medium',
            category: 'General',
            date: new Date().toLocaleString(),
            lastUpdate: new Date().toLocaleString(),
            assignedTo: null,
            resolvedBy: null,
            resolvedDate: null,
            replies: []
        };
    }
}

/**
 * Helper function to format admin reply for UI display
 * @param {Object} reply - Raw reply data from server
 * @returns {Object} Formatted reply data
 */
export function formatAdminReplyForUI(reply) {
    return {
        id: reply.id,
        sender: reply.senderType ? reply.senderType.toLowerCase() : 'unknown',
        senderName: reply.senderName || 'Unknown',
        message: reply.message || '',
        timestamp: reply.createdAt ? new Date(reply.createdAt).toLocaleString() : new Date().toLocaleString(),
        isRead: reply.readByUser || false
    };
}

/**
 * Remove all admin socket event listeners
 */
export function removeAdminInquirySocketListeners() {
    Object.values(ADMIN_EVENTS).forEach(event => {
        socket.off(event);
    });
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
}

/**
 * Get current admin socket connection status
 * @returns {Object} Connection status information
 */
export function getAdminSocketStatus() {
    return {
        isConnected: socket.connected,
        socketId: socket.id || null,
        hasSocket: !!socket
    };
}
