import { QueryResult } from "pg";
import pool from "../config/connection";
import User from "../models/user";

async function getAllUsers(req: any, res: any) {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY created_date");
        res.send(result.rows).status(200);
    } catch (error) {
        throw error;
    }
}

export default getAllUsers;