/**
 * Socket Logout Helper for Client-side
 * Handles socket disconnection during logout process
 */

import { io } from 'socket.io-client';

class SocketLogoutHelper {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
    }

    /**
     * Set the current socket instance
     * @param {object} socketInstance - Socket.io client instance
     */
    setSocket(socketInstance) {
        this.socket = socketInstance;
        this.isConnected = socketInstance?.connected || false;
        
        // Listen for logout events from server
        if (this.socket) {
            this.socket.on('auth:logout', this.handleServerLogout.bind(this));
            this.socket.on('connect', () => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
            });
            this.socket.on('disconnect', () => {
                this.isConnected = false;
            });
        }
    }

    /**
     * Handle logout event from server (force disconnect)
     * @param {object} data - Logout event data
     */
    handleServerLogout(data) {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        
        // Clear session storage
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = '/login';
    }

    /**
     * Perform logout with socket disconnection
     * @param {function} logoutApi - API function to call logout endpoint
     * @returns {Promise<boolean>} Success status
     */
    async logoutWithSocket(logoutApi) {
        try {
            // 1. Call the logout API first
            const logoutResponse = await logoutApi();
            
            if (logoutResponse && logoutResponse.ok) {
                // 2. Disconnect socket if connected
                if (this.socket && this.isConnected) {
                    this.socket.disconnect();
                    this.isConnected = false;
                }
                
                // 3. Clear local data
                this.clearLocalData();
                
                return true;
            } else {
                console.error('Logout API call failed');
                return false;
            }
            
        } catch (error) {
            console.error('Error during logout:', error);
            
            // Even if API fails, try to clean up locally
            if (this.socket && this.isConnected) {
                this.socket.disconnect();
                this.isConnected = false;
            }
            this.clearLocalData();
            
            return false;
        }
    }

    /**
     * Clear local storage and session data
     */
    clearLocalData() {
        // Clear tokens and user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('inquirySocket');
        
        // Clear session storage
        sessionStorage.clear();
        
        // Clear any inquiry-related data
        localStorage.removeItem('activeInquiries');
        localStorage.removeItem('inquiryDrafts');
    }

    /**
     * Emergency logout (force disconnect without API call)
     * Use when API is unavailable or user needs immediate logout
     */
    emergencyLogout() {
        // Disconnect socket immediately
        if (this.socket && this.isConnected) {
            this.socket.disconnect();
            this.isConnected = false;
        }
        
        // Clear all local data
        this.clearLocalData();
        
        // Redirect to login
        window.location.href = '/login';
    }

    /**
     * Check if socket is connected
     * @returns {boolean} Connection status
     */
    isSocketConnected() {
        return this.isConnected && this.socket?.connected;
    }

    /**
     * Reconnect socket if disconnected unexpectedly
     * @param {string} serverUrl - Socket server URL
     * @param {object} auth - Authentication data
     * @returns {Promise<boolean>} Reconnection success
     */
    async reconnectSocket(serverUrl, auth) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            return false;
        }

        try {
            this.reconnectAttempts++;
            
            if (this.socket) {
                this.socket.disconnect();
            }
            
            this.socket = io(serverUrl, {
                auth: auth,
                transports: ['websocket', 'polling']
            });
            
            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 5000);
                
                this.socket.on('connect', () => {
                    clearTimeout(timeout);
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    resolve(true);
                });
                
                this.socket.on('connect_error', () => {
                    clearTimeout(timeout);
                    resolve(false);
                });
            });
            
        } catch (error) {
            console.error('Socket reconnection error:', error);
            return false;
        }
    }

    /**
     * Get current connection status
     * @returns {object} Status information
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            socketId: this.socket?.id || null,
            reconnectAttempts: this.reconnectAttempts,
            hasSocket: !!this.socket
        };
    }
}

// Create singleton instance
const socketLogoutHelper = new SocketLogoutHelper();

export default socketLogoutHelper;
