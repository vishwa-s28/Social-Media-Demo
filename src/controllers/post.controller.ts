import express, { Request, Response, NextFunction } from "express";
import db from "../models";
import AppError from "../utils/error-helper";
import { POST_ERRORS } from "../constants/error.constant";

const { Post } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId, {
      attributes: { exclude: ["user_id"] },
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["id", "username", "profile_visibility"],
        },
      ],
    });
    if (!post) {
      throw new AppError(POST_ERRORS.POST_NOT_FOUND, 404);
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const createPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, caption } = req.body;

    if (!req.user || !req.user.id) {
      throw new AppError(POST_ERRORS.UNAUTHORIZED, 401);
    }

    if (!content && !caption) {
      throw new AppError(POST_ERRORS.CONTENT_OR_CAPTION_REQUIRED, 400);
    }

    const post = await db.Post.create({
      user_id: req.user.id,
      content,
      caption,
    });

    res.status(201).json({ message: POST_ERRORS.POST_CREATED, post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { content, caption } = req.body;
    if (!content && !caption) {
      throw new AppError(POST_ERRORS.UPDATE_FIELD_REQUIRED, 400);
    }

    const post = await db.Post.findByPk(id, {
      attributes: { exclude: ["user_id"] },
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["id", "username", "profile_visibility"],
        },
      ],
    });

    if (!post) {
      throw new AppError(POST_ERRORS.POST_NOT_FOUND, 404);
    }

    await post?.update({
      content,
      caption,
    });

    res.json({ message: POST_ERRORS.POST_UPDATED, post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deletedPost = await Post.destroy({ where: { id } });

    res.status(200).json({ message: POST_ERRORS.POST_DELETED });
  } catch (err) {
    next(err);
  }
};

export { createPost, getPostById, deletePost, updatePost };
