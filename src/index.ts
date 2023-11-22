import express from 'express';
import dotenv from 'dotenv';
import pool from './config/connection';
import userRoutes from './api/user';
import authRoutes from './api/auth';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.listen(process.env.PORT, () => {
    pool.connect().catch(error => {throw error});
});

app.get('/', (req, res) => {
    res.send('Live...').status(200);
});

// user api
app.use('/users', userRoutes);

// Auth api
app.use('/auth', authRoutes);