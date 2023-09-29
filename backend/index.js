import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./src/config/Database.js";
import router from "./src/routes/index.js";
import users from "./src/models/UserModel.js";

// .env configuration
dotenv.config();

const port = process.env.PORT;
const portOrigin = process.env.PORTORIGIN;

// Build express app
const app = express();

// Database connection
try {
  await db.authenticate();
  console.log("Database connected");
  await users.sync();
} catch (error) {
  console.error(error);
}

// Middleware
const middlewares = [
  cors({ credentials: true, origin: portOrigin }),
  cookieParser(),
  express.json(),
];

// Implementation middlewares
for (const middleware of middlewares) {
  app.use(middleware);
}

// Setting up route
app.use(router);

// Setting express port
app.listen(port, () => console.log(`Server running at port ${port}`));
