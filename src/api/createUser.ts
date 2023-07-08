import pool from "../config/connection";
import User from "../models/user";

async function createUser(req: any, res: any) {
    const newUser: User = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, password, email, created_date) VALUES ($1, $2, $3, $4, $5)",
            Object.values(newUser)
        );

        res.send(result).status(200);
    } catch (error) {
        throw error;
    }
    
}

export default createUser;