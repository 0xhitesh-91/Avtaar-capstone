import express from "express";
import pool from "../db.js";

const app = express();

app.use( async (req, res, next) => {
    if(!(req.session && req.session.userId)) return next();
    const user = await pool.query(`SELECT * FROM users WHERE userid = $1`, [req.session.userId]);
    if(user.rows == 0) return next();
    req.user = user.rows[0];
    next();
});

export default app;