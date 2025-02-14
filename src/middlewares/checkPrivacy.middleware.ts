import { NextFunction, Response } from "express";
import db from "../models/index";
import { CustomRequest } from "../middlewares/auth.middleware";
import AppError from "../utils/error-helper";
import { GENERAL_MESSAGES } from "../constants/error.constant";

const { Friendship, User } = db;

const checkPrivacy = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUserId = req.query.userId;
    const requestingUserId = req.user?.id;

    if (!requestingUserId) {
      throw new AppError(GENERAL_MESSAGES.UNAUTHORIZED_LOGIN, 401);
    }

    const targetUser = await User.findOne({
      where: { id: targetUserId },
      attributes: ["id", "profile_visibility"],
    });

    if (!targetUser) {
      throw new AppError(GENERAL_MESSAGES.USER_NOT_FOUND, 404);
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
      throw new AppError(GENERAL_MESSAGES.PRIVACY_DENIED, 403);
    }

    next();
  } catch (error) {
    throw new AppError(GENERAL_MESSAGES.PRIVACY_CHECK_ERROR, 500);
  }
};

export default checkPrivacy;
