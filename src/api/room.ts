import express, { Request, Response } from 'express';
import pool from '../config/connection';
import { authToken } from '../services/auth';

const roomRoutes = express.Router();
const app = express();
app.use(express.json());

// Get all rooms
roomRoutes.get('/', authToken, async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM rooms ORDER BY created_time');
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Get room info
roomRoutes.get('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const roomId = req.params.id;
        const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
        res.send(result.rows[0]).status(200);
    } catch (error) {
        throw error;
    }
});

// Get user rooms
roomRoutes.get('/userRooms/:id', authToken, async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const result = await pool.query('SELECT * FROM rooms WHERE user1_id = $1 OR user2_id = $1', [userId]);
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Create new room
roomRoutes.post('/', authToken, async (req: Request, res: Response) => {
    try {
        const {user1Id, user2Id} = req.query;
        const createdTime = new Date();

        const existingRoom = await pool.query('SELECT * FROM rooms WHERE user1_id IN ($1, $2) AND user2_id IN ($1, $2)', [user1Id, user2Id]);

        if (existingRoom.rows.length > 0)
            return res.send({Message: "Room between the 2 users already exists"}).status(400);

        await pool.query('INSERT INTO rooms (user1_id, user2_id, created_time) VALUES($1, $2, $3)', [user1Id, user2Id, createdTime]);

        res.send({Message: 'Room created successfully'}).status(200);
    } catch (error) {
        throw error;
    }
});

// Delete room
roomRoutes.delete('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const roomId = req.params.id;
        await pool.query('DELETE * FROM messages WHERE room_id = $1', [roomId]);
        await pool.query('DELETE * FROM rooms WHERE id = $1', [roomId]);
        
        res.send({Message: 'Room deleted successfully'}).status(200);
    } catch (error) {
        throw error;
    }
})

export default roomRoutes;