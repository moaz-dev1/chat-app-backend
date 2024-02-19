import express, { Request, Response } from 'express';
import pool from '../config/connection';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { authToken } from '../services/auth';

const userRoutes = express.Router();

// Get all users
userRoutes.get('/', authToken, async (req:Request, res:Response) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY created_time');
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Create new user
userRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const newUser: User = req.body;
        const salt = await bcrypt.genSalt();
        newUser.password = await bcrypt.hash(newUser.password, salt);

        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
        if(userExist.rows.length > 0) return res.send({message: 'Email already exist'}).status(400);

        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password, created_time) VALUES ($1, $2, $3, $4, $5)',
            Object.values(newUser)
        );

        res.send(result).status(200);
    } catch (error) {
        throw error;
    }
});

// Get user info
userRoutes.get('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        res.send(result.rows[0]).status(200);
    } catch (error) {
        throw error;
    }
});

// Update user info
userRoutes.put('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const userInfo: User = req.body;

        const salt = await bcrypt.genSalt();
        userInfo.password = await bcrypt.hash(userInfo.password, salt);

        const result = await pool.query('UPDATE users SET first_name = $1, last_name = $2, password = $3, email = $4 WHERE id = $5', [
            userInfo.firstName,
            userInfo.lastName,
            userInfo.password,
            userInfo.email,
            id
        ]);

        if(result)
            res.send({message: 'User info updated successfully'}).status(200);
        else 
            res.send({message: 'User not found'}).status(400);
    } catch (error) {
        throw error;
    }
});

// Delete user
userRoutes.delete('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if(result) 
            res.send({message: 'User detelted successfully'}).status(200);
        else res.send({message: 'User not found'}).status(400);
    } catch (error) {
        throw error;
    }
});

export default userRoutes;


