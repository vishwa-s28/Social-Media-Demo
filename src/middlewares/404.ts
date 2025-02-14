import { Request, Response, NextFunction } from "express";
import AppError from "../utils/error-helper";
import { GENERAL_MESSAGES } from "../constants/error.constant";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new AppError(GENERAL_MESSAGES.NOT_FOUND, 404));
};

export default notFound;
