import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
import users from "./models/UserModel.js";

dotenv.config();

// build express app
const app = express();

try {
    await db.authenticate();
    console.log("Database connected");
    await users.sync();
} catch (error) {
    console.error(error);
}

app.use(cors({credentials: true, origin:'http://localhost:5000/', }));
app.use(cookieParser())
app.use(express.json());
app.use(router);

// setting express port
app.listen(5000, () => console.log("Server running at port 5000"));