import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import sendNotification from "../config/webpush";
import AppError from "../utils/error-helper";
import { TAG_ERRORS } from "../constants/error.constant";

const { Comment, Post, Tag, User } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const tagUserInPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const { post_id, tagged_id } = req.body;

    if (!user_id) {
      throw new AppError(TAG_ERRORS.UNAUTHORIZED, 401);
    }

    const post = await Post.findByPk(post_id);
    if (!post) {
      throw new AppError(TAG_ERRORS.POST_NOT_FOUND, 404);
    }

    const tag = await Tag.create({ user_id, post_id, tagged_id });
    const tagId = tag.getDataValue("id");

    const tagWithDetails = await Tag.findByPk(tagId, {
      attributes: {
        exclude: ["user_id", "tagged_id", "post_id", "comment_id"],
      },
      include: [
        {
          model: User,
          as: "tagger",
          attributes: ["id", "username"],
        },
        {
          model: User,
          as: "taggedUser",
          attributes: ["id", "username"],
        },
        {
          model: Post,
          attributes: ["id", "caption", "content"],
        },
      ],
    });

    if (user_id !== tagged_id) {
      await sendNotification(tagged_id, {
        title: "Tag in a post",
        body: `${req.user?.email} tagged you in a post!`,
      });
    }

    res.send({ message: TAG_ERRORS.USER_TAGGED, tagWithDetails });
  } catch (err) {
    next(err);
  }
};

const tagUserInComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    const { id, tagged_id } = req.body;

    if (!user_id) {
      throw new AppError(TAG_ERRORS.UNAUTHORIZED, 401);
    }

    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new AppError(TAG_ERRORS.COMMENT_NOT_FOUND, 404);
    }

    const tag = await Tag.create({ user_id, comment_id: id, tagged_id });
    const tagId = tag.getDataValue("id");

    const tagWithDetails = await Tag.findByPk(tagId, {
      attributes: {
        exclude: ["user_id", "tagged_id", "post_id", "comment_id"],
      },
      include: [
        {
          model: User,
          as: "tagger",
          attributes: ["id", "username"],
        },
        {
          model: User,
          as: "taggedUser",
          attributes: ["id", "username"],
        },
        {
          model: Comment,
          attributes: ["id", "content"],
        },
      ],
    });

    if (user_id !== tagged_id) {
      await sendNotification(tagged_id, {
        title: "Mention in a comment",
        body: `${req.user?.email} mentioned you in a comment!`,
      });
    }

    res.send({ message: TAG_ERRORS.USER_TAGGED, tagWithDetails });
  } catch (err) {
    next(err);
  }
};

export { tagUserInPost, tagUserInComment };
