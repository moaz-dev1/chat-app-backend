import express from 'express';
import dotenv from 'dotenv';
import pool from './config/connection';
import userRoutes from './api/user';
import authRoutes from './api/auth';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.listen(PORT, () => {
    pool.connect().catch(error => {throw error});
});

app.get('/', (req, res) => {
    res.send('Live...').status(200);
});

// user api
app.use('/users', userRoutes);

// Auth api
app.use('/auth', authRoutes);



// Refresh the server every 10 mins
setTimeout(() => {
    console.log("Live");
}, 300000);