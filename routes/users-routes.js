import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json({users : users.rows});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
})

router.post('/', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser = await pool.query('INSERT INTO users(name, age, gender, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *', 
        [req.body.name, req.body.age, req.body.gender, req.body.email, hashedPassword]);
        res.json({users : newUser.rows[0]});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
})

export default router;