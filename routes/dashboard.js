import express from "express";
import pool from "../db.js";
import moment from "moment";
import {loginRequired} from "../middleware/login-required.js";

const router = express();


router.locals.moment = moment;
router.get("/", (req, res) => {
    if(req.user) return res.redirect("/dashboard");
    res.render("index");
});

router.get("/dashboard", loginRequired, async (req, res) => {
    const events = await pool.query(`SELECT eventid, events.name, description, location, startdate, enddate, users.name as username from users inner join events on users.userid = events.userid`);
    const users = await pool.query(`SELECT userid, name FROM users;`);
    res.render("dashboard", {eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
});

export default router;