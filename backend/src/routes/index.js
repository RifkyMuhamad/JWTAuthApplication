import express from "express";
import { Register } from "../controllers/RegisterController.js";
import { Login } from "../controllers/LoginController.js";
import { GetUsers } from "../controllers/GetUsersController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { RefreshToken } from "../controllers/RefreshToken.js";
import { Logout } from "../controllers/LogoutController.js";

const router = express.Router();

router.get("/users", VerifyToken, GetUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", RefreshToken);
router.delete("/logout", Logout);

export default router;