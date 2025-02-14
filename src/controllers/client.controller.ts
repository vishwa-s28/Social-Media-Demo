import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const getPrivateKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ publicVapidKey: process.env.PUBLIC_VAPID_KEY });
  } catch (err) {
    next(err);
  }
};

export { getPrivateKey };
