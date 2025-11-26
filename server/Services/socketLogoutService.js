/**
 * Socket Logout Service
 * Handles socket disconnection when users logout
 */

import socketSessionManager from '../Sockets/utils/session-manager.js';
import { ROOMS } from '../Sockets/utils/socket-events.js';

class SocketLogoutService {
    constructor() {
        this.io = null;
    }

    /**
     * Initialize the service with Socket.io instance
     * @param {object} ioInstance - Socket.io instance
     */
    init(ioInstance) {
        this.io = ioInstance;
    }

    /**
     * Disconnect all sockets for a user who logged out
     * @param {string} userId - User ID who logged out
     * @param {string} reason - Logout reason (optional)
     * @returns {number} Number of sockets disconnected
     */
    disconnectUserOnLogout(userId, reason = 'logout') {
        if (!this.io) {
            // Service not initialized
            return 0;
        }
        
        // Get user's active socket connections
        const userSockets = socketSessionManager.getUserSockets(userId);
        
        if (userSockets.size === 0) {
            return 0;
        }

        // Disconnect all user's sockets
        const disconnectedCount = socketSessionManager.disconnectUserSockets(
            userId, 
            this.io, 
            reason
        );

        // Emit to admin room that user logged out (for admin tracking)
        this.io.to(ROOMS.ADMIN).emit('user:logout', {
            userId: userId,
            timestamp: new Date().toISOString(),
            disconnectedSockets: disconnectedCount
        });

        return disconnectedCount;
    }

    /**
     * Force disconnect a specific user (admin action)
     * @param {string} userId - User ID to disconnect
     * @param {string} adminId - Admin who initiated the action
     * @param {string} reason - Reason for disconnection
     * @returns {number} Number of sockets disconnected
     */
    forceDisconnectUser(userId, adminId, reason = 'admin_action') {
        if (!this.io) {
            // Service not initialized
            return 0;
        }

        console.log(`Admin ${adminId} forcing disconnect for user ${userId}, reason: ${reason}`);
        
        const disconnectedCount = socketSessionManager.disconnectUserSockets(
            userId, 
            this.io, 
            reason
        );

        // Log the admin action
        this.io.to(ROOMS.ADMIN).emit('admin:force_disconnect', {
            targetUserId: userId,
            adminId: adminId,
            reason: reason,
            timestamp: new Date().toISOString(),
            disconnectedSockets: disconnectedCount
        });

        return disconnectedCount;
    }

    /**
     * Get connection statistics
     * @returns {object} Connection statistics
     */
    getConnectionStats() {
        return socketSessionManager.getStats();
    }

    /**
     * Check if user has active connections
     * @param {string} userId - User ID
     * @returns {boolean} True if user has active connections
     */
    isUserConnected(userId) {
        return socketSessionManager.hasActiveConnections(userId);
    }

    /**
     * Send message to all user's sockets
     * @param {string} userId - User ID
     * @param {string} event - Event name
     * @param {object} data - Event data
     * @returns {boolean} Success status
     */
    sendToUser(userId, event, data) {
        if (!this.io) {
            // Service not initialized
            return false;
        }

        this.io.to(`user_${userId}`).emit(event, data);
        return true;
    }
}

// Create singleton instance
const socketLogoutService = new SocketLogoutService();

export default socketLogoutService;
