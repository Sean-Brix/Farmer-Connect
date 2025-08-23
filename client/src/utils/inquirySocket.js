/**
 * Client-side socket integration for inquiry system
 * This file provides helper functions to integrate with the Chat components
 */

import { socket } from './socket.js';
import socketLogoutHelper from './socketLogoutHelper.js';

// Socket event constants (matching server-side)
export const CLIENT_EVENTS = {
    INQUIRIES_LIST: 'client_inquiry:inquiries_list',
    INQUIRY_CREATED: 'client_inquiry:created',
    CONVERSATION: 'client_inquiry:conversation',
    MESSAGE_SENT: 'client_inquiry:message_sent',
    NEW_REPLY: 'client_inquiry:new_reply',
    STATUS_UPDATED: 'client_inquiry:status_updated',
    CLOSED: 'client_inquiry:closed',
    ERROR: 'client_inquiry:error',
    CONNECTED: 'client_inquiry:connected'
};

export const CLIENT_ACTIONS = {
    GET_INQUIRIES: 'client_inquiry:get_inquiries',
    NEW_INQUIRY: 'client_inquiry:new',
    SEND_MESSAGE: 'client_inquiry:send',
    GET_CONVERSATION: 'client_inquiry:get_conversation',
    CLOSE_INQUIRY: 'client_inquiry:close',
    MARK_READ: 'client_inquiry:mark_read'
};

/**
 * Initialize socket connection for inquiry system
 * @param {Object} callbacks - Event callback functions
 */
export function initializeInquirySocket(callbacks = {}) {
    // Connection events
    socket.on(CLIENT_EVENTS.CONNECTED, (data) => {
        callbacks.onConnected?.(data);
    });

    // Inquiry events
    socket.on(CLIENT_EVENTS.INQUIRIES_LIST, (inquiries) => {
        callbacks.onInquiriesList?.(inquiries);
    });

    socket.on(CLIENT_EVENTS.INQUIRY_CREATED, (data) => {
        callbacks.onInquiryCreated?.(data);
    });

    socket.on(CLIENT_EVENTS.CONVERSATION, (data) => {
        callbacks.onConversation?.(data);
    });

    socket.on(CLIENT_EVENTS.MESSAGE_SENT, (data) => {
        callbacks.onMessageSent?.(data);
    });

    socket.on(CLIENT_EVENTS.NEW_REPLY, (data) => {
        callbacks.onNewReply?.(data);
    });

    socket.on(CLIENT_EVENTS.STATUS_UPDATED, (data) => {
        callbacks.onStatusUpdated?.(data);
    });

    socket.on(CLIENT_EVENTS.CLOSED, (data) => {
        callbacks.onInquiryClosed?.(data);
    });

    socket.on(CLIENT_EVENTS.ERROR, (error) => {
        console.error('Socket error:', error);
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
        console.error('Connection error:', error);
        callbacks.onConnectionError?.(error);
    });
}

/**
 * Connect socket with user role
 * @param {string} role - User role (User, Admin, Super_Admin)
 */
export function connectInquirySocket(role = 'User') {
    socket.auth = { role };
    if (!socket.connected) {
        socket.connect();
    }
    
    // Register socket with logout helper
    socketLogoutHelper.setSocket(socket);
}

/**
 * Disconnect socket
 */
export function disconnectInquirySocket() {
    socket.disconnect();
}

/**
 * Logout with socket disconnection
 * @param {function} logoutApiCall - Function that calls the logout API
 * @returns {Promise<boolean>} Success status
 */
export async function logoutWithSocket(logoutApiCall) {
    return await socketLogoutHelper.logoutWithSocket(logoutApiCall);
}

/**
 * Get user's inquiries
 */
export function getUserInquiries() {
    socket.emit(CLIENT_ACTIONS.GET_INQUIRIES);
}

/**
 * Create new inquiry
 * @param {Object} data - Inquiry data
 * @param {string} data.message - Inquiry message
 * @param {string} [data.subject] - Inquiry subject (optional, auto-generated if not provided)
 */
export function createInquiry(data) {
    socket.emit(CLIENT_ACTIONS.NEW_INQUIRY, data);
}

/**
 * Send message to existing inquiry
 * @param {Object} data - Message data
 * @param {string} data.inquiryId - Inquiry ID
 * @param {string} data.message - Message content
 */
export function sendMessage(data) {
    socket.emit(CLIENT_ACTIONS.SEND_MESSAGE, data);
}

/**
 * Get conversation for specific inquiry
 * @param {string} inquiryId - Inquiry ID
 */
export function getConversation(inquiryId) {
    socket.emit(CLIENT_ACTIONS.GET_CONVERSATION, { inquiryId });
}

/**
 * Close/cancel inquiry
 * @param {string} inquiryId - Inquiry ID
 */
export function closeInquiry(inquiryId) {
    socket.emit(CLIENT_ACTIONS.CLOSE_INQUIRY, { inquiryId });
}

/**
 * Mark inquiry as read
 * @param {string} inquiryId - Inquiry ID
 */
export function markInquiryRead(inquiryId) {
    socket.emit(CLIENT_ACTIONS.MARK_READ, { inquiryId });
}

/**
 * Remove all socket event listeners for inquiry system
 */
export function removeInquirySocketListeners() {
    Object.values(CLIENT_EVENTS).forEach(event => {
        socket.off(event);
    });
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
}

/**
 * Helper function to format inquiry for UI display
 * @param {Object} inquiry - Raw inquiry data from server
 * @returns {Object} Formatted inquiry data
 */
export function formatInquiryForUI(inquiry) {
    return {
        id: inquiry.id,
        subject: inquiry.subject,
        message: inquiry.message,
        status: inquiry.status.toLowerCase(),
        date: new Date(inquiry.createdAt).toLocaleDateString(),
        lastUpdate: new Date(inquiry.updatedAt).toLocaleDateString(),
        assignedTo: inquiry.assignedTo ? {
            name: `${inquiry.assignedTo.firstName} ${inquiry.assignedTo.surname}`,
            username: inquiry.assignedTo.username
        } : null,
        replyCount: inquiry._count?.replies || 0,
        hasUnread: inquiry.replies?.some(reply => 
            reply.senderType !== 'USER' && !reply.readByUser
        ) || false
    };
}

/**
 * Helper function to format reply for UI display
 * @param {Object} reply - Raw reply data from server
 * @returns {Object} Formatted reply data
 */
export function formatReplyForUI(reply) {
    const isFromUser = reply.senderType === 'USER';
    return {
        id: reply.id,
        from: isFromUser ? 'user' : 'admin',
        text: reply.message,
        senderName: reply.senderName,
        time: new Date(reply.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        timestamp: reply.createdAt,
        isRead: reply.readByUser
    };
}
