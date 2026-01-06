import http from 'http'
import dotenv from 'dotenv'
import colors from 'colors'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './config/app.js'
import { scheduleCleanupJob } from './jobs/cleanupDeletedReports.js'
import { startSeminarStatusUpdater } from './jobs/seminarStatusUpdater.js'

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

    // Start scheduled cleanup for soft-deleted planting reports unless disabled
    if (process.env.DISABLE_CLEANUP_JOB !== 'true') {
        scheduleCleanupJob();
    } else {
        console.log('⚠️  [Cleanup Job] Disabled via DISABLE_CLEANUP_JOB env flag');
    }

    // Start scheduled seminar status updater unless disabled
    if (process.env.DISABLE_SEMINAR_STATUS_UPDATE !== 'true') {
        startSeminarStatusUpdater();
    } else {
        console.log('⚠️  [Seminar Status Updater] Disabled via DISABLE_SEMINAR_STATUS_UPDATE env flag');
    }

})

// Socket.io REMOVED - Using HTTP Polling instead
// All real-time features now use REST API + client-side polling

export default server;
