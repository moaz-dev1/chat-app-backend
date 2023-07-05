import express from "express";
import dotenv from "dotenv";
import pool from "./database/connection";

dotenv.config();

const app = express();

app.listen(process.env.PORT, function(){
    pool.connect();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});