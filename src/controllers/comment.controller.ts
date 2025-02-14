import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import sendNotification from "../config/webpush";
import AppError from "../utils/error-helper";
import { COMMENT_ERRORS } from "../constants/error.constant";

const { Comment, Post } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const getAllCommentByUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      throw new AppError(COMMENT_ERRORS.UNAUTHORIZED, 401);
    }

    const comments = await Comment.findAll({
      where: { user_id: req.user.id },
      attributes: { exclude: ["user_id", "post_id"] },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "profile_visibility"],
        },
        {
          model: db.Post,
          as: "post",
          attributes: ["id", "content", "caption"],
        },
      ],
    });

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);

    if (!post) {
      throw new AppError(COMMENT_ERRORS.POST_NOT_FOUND, 404);
    }

    const comments = await Comment.findAll({
      where: { post_id: id },
      attributes: { exclude: ["user_id", "post_id"] },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "profile_visibility"],
        },
        {
          model: db.Post,
          as: "post",
          attributes: ["id", "content", "caption"],
        },
      ],
    });

    if (!comments.length) {
      throw new AppError(COMMENT_ERRORS.NO_COMMENTS_ON_POST, 404);
    }

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

const addComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user?.id;
    const { content, post_id } = req.body;

    const comment = await Comment.create({
      content,
      post_id,
      user_id: user,
    });

    const postOwner = await Post.findByPk(post_id);
    const postOwnerId = postOwner?.get("user_id");

    await sendNotification(postOwnerId as string, {
      title: "Comment on your post",
      body: `${req.user?.email} commented on your post!`,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const updateComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = req.body;
    const id = req.params.id;

    const comment = await Comment.findOne({
      where: { id },
      attributes: { exclude: ["user_id", "post_id"] },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "profile_visibility"],
        },
        {
          model: db.Post,
          as: "post",
          attributes: ["id", "content", "caption"],
        },
      ],
    });

    if (!comment) {
      throw new AppError(COMMENT_ERRORS.COMMENT_NOT_FOUND, 404);
    }

    await comment.update({ content });

    res.status(200).json({
      message: COMMENT_ERRORS.COMMENT_UPDATE_SUCCESS,
      comment,
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedComment = await Comment.destroy({
      where: { id },
    });

    if (!deletedComment) {
      throw new AppError(COMMENT_ERRORS.COMMENT_NOT_FOUND, 404);
    }

    res.status(200).json({ message: COMMENT_ERRORS.COMMENT_DELETE_SUCCESS });
  } catch (err) {
    next(err);
  }
};

export {
  getAllCommentByUser,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
};
