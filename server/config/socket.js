import dotenv from 'dotenv';
import { client_inquiry } from '../Sockets/handlers/client/client_inquiry.js';
import { admin_inquiry } from '../Sockets/handlers/admin/admin_inquiry.js';
import { socketAuth, validateUser } from '../Sockets/middleware/auth.js';
import { ROOMS } from '../Sockets/utils/socket-events.js';
import socketSessionManager from '../Sockets/utils/session-manager.js';
import socketLogoutService from '../Services/socketLogoutService.js';

function setup_socket(io){
    dotenv.config();
    
    // Initialize socket logout service
    socketLogoutService.init(io);
    
    // Apply authentication middleware
    io.use(socketAuth);
    io.use(validateUser);

    // Connection event
    io.on('connection', (socket) => {
        
        // Register socket connection for session management
        socketSessionManager.addSocket(socket.user.id, socket.id);
        
        // Join user-specific room for targeted messaging
        socket.join(`user_${socket.user.id}`);
        
        switch (socket.user.role) {
            case 'Admin':
            case 'Super_Admin':
                admin_inquiry(io, socket);
                break;

            case 'User': 
                client_inquiry(io, socket); 
                break;

            default:
                console.log(`Unknown role: ${socket.user.role}, disconnecting socket`);
                socket.emit('error', { message: 'Invalid user role' });
                socket.disconnect();
                return;
        }

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            socketSessionManager.removeSocket(socket.id);
        });

        // Global error handler
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.user?.username}:`, error);
        });

    });}

export { 
    setup_socket
};
