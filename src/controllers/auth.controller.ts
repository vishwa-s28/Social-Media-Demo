import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import db from "../models/index";
import axios from "axios";
import jwt from "jsonwebtoken";
import "dotenv/config";
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
      res
        .status(400)
        .json({
          message: "Missing required fields: name, email, and password.",
        });
      return;
    }

    const apiKey = process.env.API_KEY;
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

    const response = await axios.get(url);
    if (
      !response.data.is_valid_format.value ||
      response.data.deliverability !== "DELIVERABLE"
    ) {
      res
        .status(400)
        .json({ message: "Invalid email address or undeliverable email." });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({
          message:
            "Email already exists. Please use a different email address.",
        });
      return;
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
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
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
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials. User not found." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res
        .status(400)
        .json({ message: "Invalid credentials. Incorrect password." });
      return;
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
      type: "access", 
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
  }
};

export { registerUser, loginUser };
