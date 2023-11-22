import express from 'express';
import pool from '../config/connection';
import bcrypt from 'bcrypt';
import { createToken } from '../services/auth';

const authRoutes = express.Router();

// Login
authRoutes.post('/login', async (req, res) => {
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
            else res.send('Incorrect password!');
        }
        else 
            res.send('User not found!');
    } catch (error) {
        throw error;
    }
});

// Logout
authRoutes.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.send({message: 'token removed'});
});


export default authRoutes;


