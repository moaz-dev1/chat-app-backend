import express, { Request, Response } from 'express';
import pool from '../config/connection';
import { authToken } from '../services/auth';
import Message from '../models/message';

    
const messageRoutes = express.Router();

// Get all messages
messageRoutes.get('/', authToken, async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY sent_time');
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Get message info
messageRoutes.get('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
        res.send(result.rows[0]).status(200);
    } catch (error) {
        throw error;
    }
});


// Get all room messages
messageRoutes.get('/roomMessages/:roomId', authToken, async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        const result = await pool.query('SELECT * FROM messages WHERE room_id = $1 ORDER BY sent_time',
            [roomId]
        );

        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
});

// Create new message
messageRoutes.post('/', authToken, async (req: Request, res: Response) => {
    try {
        const newMessage = req.body;

        const result = await pool.query('INSERT INTO messages (sender_id, receiver_id, content, sent_time, room_id) VALUES($1, $2, $3, $4, $5) RETURNING id',
            [newMessage.senderId, newMessage.receiverId, newMessage.content, newMessage.sentTime, newMessage.roomId]
        );

        await pool.query('UPDATE rooms SET last_message_id = $1 WHERE rooms.id = $2', [result.rows[0].id, newMessage.roomId]);
        
        res.send({Message: 'New message sent successfully'}).status(200);
    } catch (error) {
        throw error;
    }
});

// Delete Message
messageRoutes.delete('/:id', authToken, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM messages WHERE id = $1', [id]);

        res.send({Message: 'Message deleted successfully'}).status(200);
    } catch (error) {
        throw error;
    }
});

export default messageRoutes;