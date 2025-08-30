import http from 'http'
import dotenv from 'dotenv'
import colors from 'colors'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './config/app.js'
import { Server } from 'socket.io';
import { setup_socket } from './config/socket.js';

// Configuration
dotenv.config();
colors.enable();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Force a stable local dev port to avoid environment overriding PORT
const PORT = 8091;

// Server
const server = http.createServer(app);

server.listen(PORT, ()=>{
    console.log(
        '\n\n\n\nLINK: '.cyan + ('http://127.0.0.1:' + PORT + '/\n').yellow.italic.underline
    );
})

// Socket.io setup
const io = new Server(server, {
    // CORS for Development
    cors: {
        origin: ["http://localhost:5173"],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true
    },
});

setup_socket(io);

export default server;
