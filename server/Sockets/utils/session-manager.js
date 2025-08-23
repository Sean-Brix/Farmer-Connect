/**
 * Socket Session Manager
 * Tracks active socket connections by user ID for disconnect on logout
 */

class SocketSessionManager {
    constructor() {
        // Map of userId -> Set of socket IDs
        this.userSockets = new Map();
        // Map of socketId -> userId for reverse lookup
        this.socketUsers = new Map();
    }

    /**
     * Register a socket connection for a user
     * @param {string} userId - User ID
     * @param {string} socketId - Socket ID
     */
    addSocket(userId, socketId) {
        // Add to user's socket set
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(socketId);
        
        // Add reverse mapping
        this.socketUsers.set(socketId, userId);
    }

    /**
     * Remove a socket connection
     * @param {string} socketId - Socket ID
     */
    removeSocket(socketId) {
        const userId = this.socketUsers.get(socketId);
        if (userId) {
            // Remove from user's socket set
            const userSocketSet = this.userSockets.get(userId);
            if (userSocketSet) {
                userSocketSet.delete(socketId);
                
                // If no more sockets for user, remove the user entry
                if (userSocketSet.size === 0) {
                    this.userSockets.delete(userId);
                }
            }
            
            // Remove reverse mapping
            this.socketUsers.delete(socketId);
        }
    }

    /**
     * Get all socket IDs for a user
     * @param {string} userId - User ID
     * @returns {Set<string>} Set of socket IDs
     */
    getUserSockets(userId) {
        return this.userSockets.get(userId) || new Set();
    }

    /**
     * Disconnect all sockets for a user
     * @param {string} userId - User ID
     * @param {object} io - Socket.io instance
     * @param {string} reason - Disconnection reason
     */
    disconnectUserSockets(userId, io, reason = 'logout') {
        const socketIds = this.getUserSockets(userId);
        
        if (socketIds.size === 0) {
            return 0;
        }

        let disconnectedCount = 0;
        socketIds.forEach(socketId => {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                // Emit logout event before disconnecting
                socket.emit('auth:logout', { 
                    message: 'User logged out from another session',
                    reason: reason 
                });
                
                // Disconnect the socket
                socket.disconnect(true);
                disconnectedCount++;
            }
            
            // Clean up tracking
            this.removeSocket(socketId);
        });

        return disconnectedCount;
    }

    /**
     * Get total number of active connections
     * @returns {number} Total active connections
     */
    getTotalConnections() {
        return this.socketUsers.size;
    }

    /**
     * Get total number of unique users
     * @returns {number} Total unique users
     */
    getTotalUsers() {
        return this.userSockets.size;
    }

    /**
     * Get connection statistics
     * @returns {object} Connection statistics
     */
    getStats() {
        const stats = {
            totalConnections: this.getTotalConnections(),
            totalUsers: this.getTotalUsers(),
            userConnections: {}
        };

        this.userSockets.forEach((sockets, userId) => {
            stats.userConnections[userId] = sockets.size;
        });

        return stats;
    }

    /**
     * Check if user has active connections
     * @param {string} userId - User ID
     * @returns {boolean} True if user has active connections
     */
    hasActiveConnections(userId) {
        const sockets = this.getUserSockets(userId);
        return sockets.size > 0;
    }
}

// Create singleton instance
const socketSessionManager = new SocketSessionManager();

export default socketSessionManager;
