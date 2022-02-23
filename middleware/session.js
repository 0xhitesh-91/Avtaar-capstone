import express from "express";
import sessions from "client-sessions";

const app = express();

app.use(sessions({
    cookieName: "session",
    secret: "jafjlfd6fgdgd644g6dg6",
    duration: 60 * 1000,
}));

export default app;