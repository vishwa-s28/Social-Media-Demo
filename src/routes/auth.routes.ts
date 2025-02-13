import express, { Express, Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validation.middleware";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
