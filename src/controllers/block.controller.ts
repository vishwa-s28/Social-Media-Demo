import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import AppError from "../utils/error-helper";
import { BLOCK_ERRORS } from "../constants/error.constant";

const { User, Block } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const blockUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const blocked_id = req.body.id;

    const blockedUser = await User.findByPk(blocked_id);
    if (!blockedUser) {
      throw new AppError(BLOCK_ERRORS.USER_NOT_FOUND, 404);
    }

    if (user_id === blocked_id) {
      throw new AppError(BLOCK_ERRORS.CANNOT_BLOCK_SELF, 400);
    }

    await Block.create({
      blocker_id: user_id,
      blocked_id,
    });

    res.status(200).json({
      message: BLOCK_ERRORS.BLOCK_SUCCESS,
    });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const blocked_id = req.body.id;

    const blockedUser = await Block.findOne({
      where: { blocker_id: user_id, blocked_id },
    });

    if (!blockedUser) {
      throw new AppError(BLOCK_ERRORS.USER_NOT_BLOCKED, 404);
    }

    await Block.destroy({
      where: {
        blocker_id: user_id,
        blocked_id,
      },
    });

    res.status(200).json({
      message: BLOCK_ERRORS.UNBLOCK_SUCCESS,
    });
  } catch (err) {
    next(err);
  }
};

export { blockUser, unblockUser };
