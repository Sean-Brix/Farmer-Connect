import http from 'http'
import dotenv from 'dotenv'
import colors from 'colors'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './config/app.js'

// Configuration
dotenv.config();
colors.enable();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Server
const server = http.createServer(app);

server.listen(PORT, ()=>{
    console.log(
        '\n\n\n\nLINK: '.cyan + ('http://127.0.0.1:' + PORT + '/\n').yellow.italic.underline
    );
    console.log('Socket.io: DISABLED - Using HTTP Polling for real-time features'.green);
})

// Socket.io REMOVED - Using HTTP Polling instead
// All real-time features now use REST API + client-side polling

export default server;
