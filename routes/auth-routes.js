import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { jwtTokens } from "../utils/jwt-helpers.js";
//import {jwtTokens} form "../utils/jwt-helpers.js";

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        //email check
        if(users.rows.length === 0) return res.status(401).json({error : "Email is incorrect"})

        //password check
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if(!validPassword) return res.status(401).json({error: "Incorrect password"});
        
        //jwt
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
        res.json(tokens)
    } catch (error) {
        res.status(401).json({error: error.message});
    }
})



export default router;