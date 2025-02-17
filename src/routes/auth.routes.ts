import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validation.middleware";
import { AUTH } from "../constants/endpoint.constant";
import { authenticateToken } from "../middlewares/auth.middleware";
import { uploadProfileImage } from "../middlewares/upload-image.middleware";

const router = express.Router();

router.post(AUTH.REGISTER, uploadProfileImage, validateRegister, registerUser);
router.post(AUTH.LOGIN, validateLogin, loginUser);
router.post(AUTH.LOGOUT, authenticateToken, logoutUser);

export default router;
