import express from "express";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import pool from "../db.js";

const router = express();

router.get("/register", (req, res) => {
    if(req.user) return res.redirect("/dashboard");
    res.render("register")
});

router.post("/register", async (req, res) => {
    try {
        const {email} = req.body;
        const dublicateEmail = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
        if(dublicateEmail.rowCount) return res.render("register", {status: "Email already exist"});
        let hash = bcrypt.hashSync(req.body.password, 14);
        req.body.password = hash;
        const newUser = await pool.query(`INSERT INTO users(name, age, gender, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [req.body.name, req.body.age, req.body.gender, req.body.email, req.body.password]);
        req.session.userId = newUser.rows[0].userid;
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error.message);
        res.status(400).json({error: error.message, firstname: req.body.name});
    }
});

router.get("/login", (req, res) => {
    if(req.user) return res.redirect("/dashboard");
    res.render("login");
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const users = await pool.query('SELECT * FROM users where email = $1', [email]);
        if(users.rows.length == 0) return res.render("login", {error: "email is incorrect"});
        const validPassword = bcrypt.compareSync(password, users.rows[0].password);
        if(!validPassword) return res.render("login", {error: "password is incorrect"});
        req.session.userId = users.rows[0].userid;
        res.redirect("/dashboard");
    } catch (error) {
        res.json(error.message);
    }
});

router.post("/logout",  async(req, res) => {
    try {
        req.session.userId = "fab99a0a-0747-4ca2-b14a-a00f70c33948";
        res.redirect("/");
    } catch (error) {
        res.send(error.message);
    }
});

export default router;