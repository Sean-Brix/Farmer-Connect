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
const viewPath = path.join(__dirname, '../View');
const publicPath = path.join(__dirname, '../public');

// Initialize i18n - temporarily disabled
// await initI18n();

// Request Handler
const app = express();

// Middleware
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(viewPath));
app.use('/public', express.static(publicPath));

// i18n middleware - temporarily disabled
// app.use(i18nMiddleware.handle);

app.use(
    cors({
        origin: '*',
        allowedHeaders: ['POST', 'GET', 'DELETE', 'PUT'],
        credentials: true,
    })
);

// API Route
import index from '../Router/index.js';
app.use('/', index);

app.use((req, res) => {
    res.sendFile(viewPath);
});

export default app;
