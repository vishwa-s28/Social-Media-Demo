import express, { Express, Request, Response, NextFunction } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validation.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/logout", authenticateToken, logoutUser);

export default router;
