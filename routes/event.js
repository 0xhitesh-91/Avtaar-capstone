import express from "express";
import bodyParser from "body-parser";
import pool from "../db.js";
import moment from "moment";

const router = express();

router.locals.moment = moment;
router.use(bodyParser.urlencoded({
    extended: false
}));

router.get("/", async(req, res) => {
    try {
        console.log("fetching events");
        const events = await pool.query(`SELECT eventid, events.name, description, location, startdate, enddate, users.name as username from users inner join events on users.userid = events.userid`);
        const users = await pool.query(`SELECT name FROM users;`);
        res.render("dashboard", {eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/", async(req, res) => {
    try {
        const {eventName, eventDiscription, eventLocation, eventStartdate, eventEnddate, username} = req.body;
        const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        var events = await pool.query(`SELECT eventid, events.name, description, location, startdate, enddate, users.name as username from users inner join events on users.userid = events.userid`);
        const users = await pool.query(`SELECT name FROM users;`);
        
        if(yesterdayDate >= eventStartdate) 
            return res.render("dashboard", {status: "Event can not be scheduled in past", eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
        if(eventStartdate > eventEnddate) 
            return res.render("dashboard", {status: "Event end date should be greater than start", eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
        
        const userid = await pool.query(`SELECT userid FROM users where name = $1`,[username]);
        const newEvent = await pool.query(`INSERT INTO events(name, description, location, startdate, enddate, userid) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [eventName, eventDiscription, eventLocation, eventStartdate, eventEnddate, userid.rows[0].userid]);
        events = await pool.query(`SELECT eventid, events.name, description, location, startdate, enddate, users.name as username from users inner join events on users.userid = events.userid`);
        res.render("dashboard", {status: `Event \"${newEvent.rows[0].name}\" added successfully`, eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/searchEvents", async(req, res) => {
    try {
        const {startdate, enddate} = req.body;
        const users = await pool.query(`SELECT name FROM users;`);
        const events = await pool.query(`SELECT eventid, events.name, description, location, startdate, enddate, users.name as username from users inner join events on users.userid = events.userid WHERE (startdate, enddate) OVERLAPS ($1::DATE, $2::DATE)`,[startdate, enddate]);
        res.render("dashboard", {searchstatus: `Fetched events between ${startdate} - ${enddate}`, eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
    } catch (error) {
        res.send(error.message);
    }
})

router.post("/searchEventUserWise", async(req, res) => {
    try {
        const {name} = req.body;
        const users = await pool.query(`SELECT name FROM users;`);
        const events = await pool.query(`SELECT eventid, events.name, description, location, startdate, enddate, users.name as username from users inner join events on users.userid = events.userid WHERE users.name = $1`,[name]);
        res.render("dashboard", {eventList: events.rows, username: `Welcome ${req.user.name}`, userList: users.rows, email: req.user.email});
    } catch (error) {
        res.send(error.message);
    }
})

export default router;