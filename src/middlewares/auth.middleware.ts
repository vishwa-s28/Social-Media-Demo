import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import AppError from "../utils/error-helper";
import { GENERAL_MESSAGES } from "../constants/error.constant";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  token?: string;
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError(GENERAL_MESSAGES.ACCESS_TOKEN_MISSING, 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    req.token = token;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(GENERAL_MESSAGES.TOKEN_EXPIRED, 401);
    }
    res.status(403).json({ message: GENERAL_MESSAGES.INVALID_TOKEN });
  }
};

const authorizeRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      throw new AppError(GENERAL_MESSAGES.UNAUTHORIZED_ACCESS, 403);
    }

    next();
  };
};

export { authenticateToken, authorizeRole, CustomRequest };
