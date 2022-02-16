import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

router.get('/', authenticateToken, async(req, res) => {
    try {
        const events = await pool.query('SELECT * FROM events');
        res.json({events : events.rows});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
})

export default router;