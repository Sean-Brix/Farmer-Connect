import express, { urlencoded } from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request Handler
const app = express();

// Middleware
app.use(urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "*",
    allowedHeaders: ['POST', 'GET'],
    credentials: true,
    
}));

// Route
import index from './API/index.js'
app.use('/', index);

// 404 Request
app.use((req, res)=>{
    res.status(404).send("<h1> 404 PAGE NOT FOUND </h1>");
});

export default app;