import express from 'express';
import pool from '../config/connection';
import User from '../models/user';
import bcrypt from 'bcrypt';

const userRoutes = express.Router();

// Get all users
userRoutes.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY created_date');
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Create new user
userRoutes.post('/', async (req, res) => {
    try {
        const newUser: User = req.body;
        const salt = await bcrypt.genSalt();
        newUser.password = await bcrypt.hash(newUser.password, salt);    

        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, password, email, created_date) VALUES ($1, $2, $3, $4, $5)',
            Object.values(newUser)
        );

        res.send(result).status(200);
    } catch (error) {
        throw error;
    }
});

// Get user info
userRoutes.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Update user info
userRoutes.post('/:id', async (req, res) => {
    const userInfo: User = req.body;
    try {
        // const result = pool.query('UPDATE users SET firstName, lastName, password, email')
    } catch (error) {
        throw error;
    }
});

// Delete user
userRoutes.delete('/:id', async (req, res) => {
    try {
        
    } catch (error) {
        throw error;
    }
});

export default userRoutes;


