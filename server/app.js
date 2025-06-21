import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Configuration
dotenv.config();
const app = express();

// Middleware
app.use(urlencoded({extended: true}));
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