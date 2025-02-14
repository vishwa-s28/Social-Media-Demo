import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import AppError from "../utils/error-helper";
import { SHARE_ERRORS } from "../constants/error.constant";

const { Share, Post, User } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const sharePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sender_id = req.user?.id;
    const { post_id, receiver_id } = req.body;

    if (!sender_id) {
      throw new AppError(SHARE_ERRORS.UNAUTHORIZED, 401);
    }

    const post = await Post.findByPk(post_id);
    if (!post) {
      throw new AppError(SHARE_ERRORS.POST_NOT_FOUND, 404);
    }

    const share = await Share.create({ sender_id, receiver_id, post_id });
    const shareId = share.getDataValue("id");

    const shareWithDetails = await Share.findByPk(shareId, {
      attributes: {
        exclude: ["sender_id", "receiver_id", "post_id"],
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "username"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "username"],
        },
        {
          model: Post,
          as: "SharedPost",
          attributes: ["id", "caption", "content"],
        },
      ],
    });

    res.send({ message: SHARE_ERRORS.POST_SHARED, shareWithDetails });
  } catch (err) {
    next(err);
  }
};

export { sharePost };
