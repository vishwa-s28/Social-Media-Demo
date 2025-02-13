import { NextFunction, Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../validations/schema";

const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      next();
    }
  };
};

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
