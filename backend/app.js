import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/functions/connectDB.js';

import createTodoRepository from './src/repositories/todo.js';
import createUserRepository from './src/repositories/user.js';

import todoRouter from './src/routers/todo.js';
import userRouter from './src/routers/user.js';


(async () => {
    const {FRONTEND_DOMAIN, FRONTEND_URL, TODOX_DB_NAME} = process.env;
    const PORT = process.env.PORT || 4000;
    const app = express();
    app.set('trust proxy', true);
    app.use(cookieParser());
    app.use(express.json({ limit: '100mb' }));
    
    // Prevent CORS issues
    app.use((req, res, next) => {
        const allowedOrigins = [process.env.FRONTEND_URL]; // Ensure this is correctly set in .env
        const origin = req.headers.origin;
    
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
        }
    
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
    
        next();
    });

    // Accept pre-flight requests
    app.options('/*', (_, res) => {
        res.sendStatus(200);
    });

    // Connect database
    const todoxDB = await connectDB(TODOX_DB_NAME);

    const todoRepository = createTodoRepository(todoxDB);
    const userRepository = createUserRepository(todoxDB);

    // Initialize routers
    app.use('/health', (req, res) => {
        res.status(200).send("Ok");
    });
    app.use('/todo', todoRouter({todoRepository}));
    app.use('/user', userRouter({userRepository}));

    app.listen(PORT, () => {
        console.log(`TodoX API listening on Port ${PORT}`);
    });
})();