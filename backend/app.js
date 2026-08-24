import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser'

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN
}));

app.use(cookieparser());

app.use(express.json());

app.use(express.urlencoded());

app.use(cors());

import { router } from './routes/user.route.js';

app.use('/api/v2/user', router);

export default app