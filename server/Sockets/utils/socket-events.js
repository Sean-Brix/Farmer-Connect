/**
 * Socket Event Constants for Inquiry System
 * Centralizes all socket event names for consistency
 */

// Client Events (sent TO client)
export const CLIENT_EVENTS = {
    // Inquiry Management
    INQUIRIES_LIST: 'client_inquiry:inquiries_list',
    INQUIRY_CREATED: 'client_inquiry:created',
    CONVERSATION: 'client_inquiry:conversation',
    MESSAGE_SENT: 'client_inquiry:message_sent',
    CLOSED: 'client_inquiry:closed',
    MARKED_READ: 'client_inquiry:marked_read',
    
    // Real-time Updates
    NEW_REPLY: 'client_inquiry:new_reply',
    STATUS_UPDATED: 'client_inquiry:status_updated',
    ASSIGNED: 'client_inquiry:assigned',
    
    // System
    ERROR: 'client_inquiry:error',
    CONNECTED: 'client_inquiry:connected',
    TYPING: 'client_inquiry:typing'
};

// Client Listeners (received FROM client)
export const CLIENT_LISTENERS = {
    // Inquiry Management
    GET_INQUIRIES: 'client_inquiry:get_inquiries',
    NEW_INQUIRY: 'client_inquiry:new',
    SEND_MESSAGE: 'client_inquiry:send',
    GET_CONVERSATION: 'client_inquiry:get_conversation',
    CLOSE_INQUIRY: 'client_inquiry:close',
    MARK_READ: 'client_inquiry:mark_read',
    
    // Real-time Features
    TYPING_START: 'client_inquiry:typing_start',
    TYPING_STOP: 'client_inquiry:typing_stop',
    
    // System
    DISCONNECT: 'disconnect'
};

// Admin Events (sent TO admin)
export const ADMIN_EVENTS = {
    // Inquiry Management
    INQUIRIES_LIST: 'admin_inquiry:inquiries_list',
    NEW_INQUIRY: 'admin_inquiry:new_inquiry',
    NEW_MESSAGE: 'admin_inquiry:new_message',
    MESSAGE_UPDATE: 'admin_inquiry:message_update',
    INQUIRY_CLOSED: 'admin_inquiry:inquiry_closed',
    STATS_UPDATE: 'admin_inquiry:stats_update',
    
    // Assignment
    INQUIRY_ASSIGNED: 'admin_inquiry:inquiry_assigned',
    ASSIGNMENT_REMOVED: 'admin_inquiry:assignment_removed',
    
    // System
    ERROR: 'admin_inquiry:error',
    CONNECTED: 'admin_inquiry:connected'
};

// Admin Listeners (received FROM admin)
export const ADMIN_LISTENERS = {
    // Inquiry Management
    GET_INQUIRIES: 'admin_inquiry:get_inquiries',
    GET_CONVERSATION: 'admin_inquiry:get_conversation',
    SEND_REPLY: 'admin_inquiry:send_reply',
    UPDATE_STATUS: 'admin_inquiry:update_status',
    ASSIGN_INQUIRY: 'admin_inquiry:assign_inquiry',
    CLOSE_INQUIRY: 'admin_inquiry:close_inquiry',
    
    // Statistics
    GET_STATS: 'admin_inquiry:get_stats',
    
    // System
    JOIN_ADMIN_ROOM: 'admin_inquiry:join_room',
    DISCONNECT: 'disconnect'
};

// Room Names
export const ROOMS = {
    ADMIN_ROOM: 'admin_room',
    USER_PREFIX: 'user_',
    ADMIN_PREFIX: 'admin_',
    INQUIRY_PREFIX: 'inquiry_'
};

// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    INQUIRY_NOT_FOUND: 'Inquiry not found',
    INVALID_DATA: 'Invalid data provided',
    DATABASE_ERROR: 'Database operation failed',
    PERMISSION_DENIED: 'Permission denied',
    USER_NOT_FOUND: 'User not found',
    ALREADY_ASSIGNED: 'Inquiry already assigned',
    INVALID_STATUS: 'Invalid status transition'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    INQUIRY_CREATED: 'Inquiry created successfully',
    MESSAGE_SENT: 'Message sent successfully',
    STATUS_UPDATED: 'Status updated successfully',
    INQUIRY_ASSIGNED: 'Inquiry assigned successfully',
    INQUIRY_CLOSED: 'Inquiry closed successfully'
};
