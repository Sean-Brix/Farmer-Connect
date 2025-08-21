import dotenv from 'dotenv';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { client_inquiry } from '../Sockets/handlers/client/client_inquiry.js';
import { admin_inquiry } from '../Sockets/handlers/admin/admin_inquiry.js';

function setup_socket(io){

    dotenv.config();
    // Authentication
    io.use((socket, next) => {
        const role = socket.handshake.auth.role;
        const rawCookie = socket.handshake.headers.cookie;
        if(!rawCookie) {
            console.log('No cookie found, disconnecting socket');
            socket.disconnect();
            return;
        }

        const parsed = cookie.parse(rawCookie);
        const token = parsed['token'];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = {...decoded, role};
        next();
    });

    // Connection event
    io.on('connection', (socket) => {

        switch (socket.user.role) {

            case 'Admin':
            case 'Super_Admin':
                admin_inquiry(io, socket);
                break;

            case 'User': 
                client_inquiry(io, socket); 
                break;

            default:
                // Disconnect if role is not recognized
                console.log('Unknown role, disconnecting socket');
                socket.disconnect();
                return;
        }

    }); 

}

export { 
    setup_socket
};
