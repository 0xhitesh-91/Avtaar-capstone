import express from "express";
import eventRouter from "./routes/event.js";
import authRouter from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import smartMiddleware from "./middleware/smart-middleware.js";
import bodyParser from "./middleware/body-parser.js";
import session from "./middleware/session.js";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");

//Middlewares
app.use(session);
app.use(bodyParser);
app.use(smartMiddleware);


//Router
app.use("/", dashboardRoutes);
app.use("/event", eventRouter);
app.use("/auth", authRouter);

app.listen(PORT, ()=> {
    console.log(`Server is listening on port:${PORT}`);
});