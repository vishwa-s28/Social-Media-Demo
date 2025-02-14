import { Request, Response, NextFunction } from "express";
import db from "../models/index";
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
      res.status(400).json({ error: "Subscription object is required" });
      return;
    }

    if (!user_id || !token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await Token.update(
      { push_subscription: subscription },
      { where: { user_id, token } }
    );
    res.status(201).json({ message: "Notifications enabled successfully" });
    return;
  } catch (err) {
    console.error("Error saving subscription:", err);
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

    // if (!subscription) {
    //   res.status(400).json({ error: "Subscription object is required" });
    //   return;
    // }

    if (!user_id || !token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await Token.update(
      { push_subscription: null },
      { where: { user_id, token } }
    );
    res.status(201).json({ message: "Notifications disabled successfully" });
    return;
  } catch (err) {
    console.error("Error saving subscription:", err);
    next(err);
  }
};

export { userSubscription, userUnsubscription };
