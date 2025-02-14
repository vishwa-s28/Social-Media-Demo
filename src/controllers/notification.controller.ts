import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import AppError from "../utils/error-helper";
import { SUBSCRIPTION_ERRORS } from "../constants/error.constant";

const { Token } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  token?: string;
}

const userSubscription = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subscription } = req.body;
    const user_id = req.user?.id;
    const token = req.token;

    if (!subscription) {
      throw new AppError(SUBSCRIPTION_ERRORS.SUBSCRIPTION_REQUIRED, 400);
    }

    if (!user_id || !token) {
      throw new AppError(SUBSCRIPTION_ERRORS.UNAUTHORIZED, 401);
    }

    await Token.update(
      { push_subscription: subscription },
      { where: { user_id, token } }
    );

    res.status(201).json({ message: SUBSCRIPTION_ERRORS.SUBSCRIPTION_ENABLED });
  } catch (err) {
    next(err);
  }
};

const userUnsubscription = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const token = req.token;

    if (!user_id || !token) {
      throw new AppError(SUBSCRIPTION_ERRORS.UNAUTHORIZED, 401);
    }

    await Token.update(
      { push_subscription: null },
      { where: { user_id, token } }
    );

    res
      .status(201)
      .json({ message: SUBSCRIPTION_ERRORS.SUBSCRIPTION_DISABLED });
  } catch (err) {
    next(err);
  }
};

export { userSubscription, userUnsubscription };
