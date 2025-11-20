import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Temporarily disabled server-side i18n to fix startup issues
// import { initI18n, middleware as i18nMiddleware } from '../i18n.js';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');
const reactAppPath = path.join(__dirname, '../public/app');
const reactIndexPath = path.join(reactAppPath, 'index.html');

// Initialize i18n - temporarily disabled
// await initI18n();

// Request Handler
const app = express();

// Import request queue middleware
import { requestQueueMiddleware, requestTimingMiddleware, getHealthStats } from '../Middlewares/requestQueue.js';

// Middleware
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Request timing and queue management (before routes)
app.use(requestTimingMiddleware);
app.use(requestQueueMiddleware);

// Serve static files from public directory (images, uploads, etc.)
app.use('/public', express.static(publicPath));

// Serve React app static files (JS, CSS, images from Vite build)
app.use(express.static(reactAppPath));

// i18n middleware - temporarily disabled
// app.use(i18nMiddleware.handle);

app.use(
    cors({
        origin: '*',
        allowedHeaders: ['POST', 'GET', 'DELETE', 'PUT'],
        credentials: true,
    })
);

// Health check endpoint (before routes)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        ...getHealthStats()
    });
});

// API Route
import index from '../Router/index.js';
app.use('/', index);

// SPA Fallback - serve index.html for all non-API routes
app.use((req, res) => {
    res.sendFile(reactIndexPath);
});

export default app;
