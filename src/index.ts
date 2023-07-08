import express from "express";
import dotenv from "dotenv";
import pool from "./config/connection";
import createUser from "./api/createUser";
import getAllUsers from "./api/getAllUsers";

dotenv.config();
const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
    pool.connect();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/createUser", createUser);
app.get("/getAllUsers", getAllUsers);