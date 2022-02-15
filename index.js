import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;
const corsOptions = {Credential:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use('/', express.static(join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
})