import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import AppError from "../utils/error-helper";
import { LIKE_ERRORS } from "../constants/error.constant";

const { Comment, Post, Like, User } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const likePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const { post_id } = req.body;

    const post = await Post.findByPk(post_id);
    if (!post) {
      throw new AppError(LIKE_ERRORS.POST_NOT_FOUND, 404);
    }

    const like = await Like.create({ user_id, post_id });
    const likeId = like.getDataValue("id");

    const likeWithDetails = await Like.findByPk(likeId, {
      attributes: { exclude: ["user_id", "post_id", "comment_id"] },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Post,
          attributes: ["id", "caption", "content"],
        },
      ],
    });

    res.send({ message: LIKE_ERRORS.POST_LIKED_SUCCESS, likeWithDetails });
  } catch (err) {
    next(err);
  }
};

const likeComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const { comment_id } = req.body;

    const comment = await Comment.findByPk(comment_id);
    if (!comment) {
      throw new AppError(LIKE_ERRORS.COMMENT_NOT_FOUND, 404);
    }

    const like = await Like.create({ user_id, comment_id });
    const likeId = like.getDataValue("id");

    const likeWithDetails = await Like.findByPk(likeId, {
      attributes: { exclude: ["user_id", "post_id", "comment_id"] },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Comment,
          attributes: ["id", "content"],
        },
      ],
    });

    res.send({ message: LIKE_ERRORS.COMMENT_LIKED_SUCCESS, likeWithDetails });
  } catch (err) {
    next(err);
  }
};

export { likePost, likeComment };
