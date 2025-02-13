import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
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
      res.status(401).json({ message: "Access token is missing" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    // Pass only payload (id and email) to req
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.status(403).json({ message: "Invalid token" });
  }
};

const authorizeRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
      return;
    }

    next();
  };
};

export { authenticateToken, authorizeRole, CustomRequest };
