import { NextFunction, Request, Response } from "express";
import db from "../models/index";
const { Friendship, User } = db;

import { CustomRequest } from "../middlewares/auth.middleware";

const checkPrivacy = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = req.query.userId;
    const requestingUserId = req.user?.id;

    if (!requestingUserId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
      return;
    }

    const targetUser = await User.findOne({
      where: { id: targetUserId },
      attributes: ["id", "profile_visibility"],
    });

    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: "The user does not exist.",
      });
      return;
    }

    if (targetUser.profile_visibility === "public") {
      next();
      return;
    }

    const isFriend = await Friendship.findOne({
      where: {
        user_id: targetUserId,
        friend_id: requestingUserId,
      },
    });

    if (!isFriend) {
      res.status(403).json({
        success: false,
        message: "Access denied. This user's account is private.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking privacy:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while checking privacy settings.",
    });
  }
};

export default checkPrivacy;
