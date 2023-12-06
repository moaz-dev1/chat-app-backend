import express, { Request, Response } from 'express';
import pool from '../config/connection';
import bcrypt from 'bcrypt';
import { authToken, createToken } from '../services/auth';

const authRoutes = express.Router();

// Login
authRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(result.rowCount) {
            if(await bcrypt.compare(password, result.rows[0].password)) {
                const token = createToken(result.rows[0].id);
                res.cookie('token', token, {
                    maxAge: 10000 * 24 * 60 * 60,
                });
                res.send(token).status(200);
            }
            else res.send('Incorrect password!').status(400);
        }
        else 
            res.send('User not found!').status(400);
    } catch (error) {
        throw error;
    }
});

// Logout
authRoutes.get('/logout', authToken, (req: Request, res: Response) => {
    res.clearCookie('token');
    res.send({message: 'token removed'}).status(200);
});


export default authRoutes;


