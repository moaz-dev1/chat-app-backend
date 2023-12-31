import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Create new token
function createToken(id: string) {
    try {
        return jwt.sign({id}, 'secret token', {'expiresIn': '3000d'});
    } catch (error) {
        throw error;
    }
}

// Check if token is valid
function authToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers['token'] as string;
        if(token) {
            jwt.verify(token, 'secret token', (error: any, decoded: any) => {
                if(error) 
                    return res.send({message: "Unauthorized"}).status(400);
                next();
            });
        } else res.send({message: "No token"}).status(400);
    } catch (error) {
        throw error;
    }
}

export {createToken, authToken};