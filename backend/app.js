import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser'

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieparser());

app.use(express.json());

app.use(express.urlencoded());

import { router } from './routes/user.route.js';

app.use('/api/v2/user', router);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
        data: err.data || null
    });
});

export default app