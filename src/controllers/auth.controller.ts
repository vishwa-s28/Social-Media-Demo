import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import db from "../models/index";
import axios from "axios";
import jwt from "jsonwebtoken";
import "dotenv/config";
import AppError from "../utils/error-helper";
import { AUTH_ERRORS } from "../constants/error.constant";

const { User, Token } = db;

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      role,
      bio,
      profileImage,
      profileVisibility,
    } = req.body;

    if (!username || !email || !password) {
      throw new AppError(AUTH_ERRORS.MISSING_FIELDS, 400);
    }

    const apiKey = process.env.API_KEY;
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    const response = await axios.get(url);
    if (
      !response.data.is_valid_format.value ||
      response.data.deliverability !== "DELIVERABLE"
    ) {
      throw new AppError(AUTH_ERRORS.INVALID_EMAIL, 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(AUTH_ERRORS.EMAIL_EXISTS, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      ...(role && { role }),
      ...(bio && { bio }),
      ...(profileImage && { profile_image: profileImage }),
      ...(profileVisibility && { profile_visibility: profileVisibility }),
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// Login User function
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(AUTH_ERRORS.LOGIN_REQUIRED, 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(AUTH_ERRORS.INCORRECT_PASSWORD, 400);
    }

    const expiration: string = process.env.JWT_EXPIRATION || "1h";

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: expiration as jwt.SignOptions["expiresIn"] }
    );

    await Token.create({
      user_id: user.id,
      token,
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(AUTH_ERRORS.UNAUTHORIZED, 401);
    }

    const token = authHeader.split(" ")[1];
    const deletedToken = await Token.destroy({ where: { token } });

    if (!deletedToken) {
      throw new AppError(AUTH_ERRORS.LOGOUT_FAILED, 400);
    }

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, logoutUser };
