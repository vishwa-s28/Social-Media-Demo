import { Request, Response, NextFunction } from "express";
import { GENERAL_MESSAGES } from "../constants/error.constant";

interface CustomError extends Error {
  statusCode?: number;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || GENERAL_MESSAGES.INTERNA_SERVER_ERROR;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

export default globalErrorHandler;
