import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request Handler
const app = express();

// Middleware
app.use(urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../View')));

app.use(cors({
    origin: "*",
    allowedHeaders: ['POST', 'GET'],
    credentials: true,
}));


// API Route
import index from '../Router/index.js'
app.use('/api', index);

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../View/index.html'), (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Internal Server Error");
        } else {
            console.log("File sent successfully");
        }
    });
});

export default app;