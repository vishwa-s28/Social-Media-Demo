import { Request, Response, NextFunction } from "express";
import db from "../models/index";
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
      res.status(404).send({ message: "User not found" });
    }
    if (user_id === blocked_id) {
      res.status(404).send({ message: "You cannot block yourself." });
    }
    await Block.create({
      blocker_id: user_id,
      blocked_id,
    });
    res.status(200).json({
      message: "User has been successfully blocked.",
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
      res.status(404).send({ message: "User is not blocked" });
    }
    await Block.destroy({
      where: {
        blocker_id: user_id,
        blocked_id,
      },
    });
    res.status(200).json({
      message: "User has been successfully unblocked.",
    });
  } catch (err) {
    next(err);
  }
};

export { blockUser, unblockUser };
