import express, { Request, Response, NextFunction } from "express";
import db from "../models";
const { Post } = db;
interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const getAllPosts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({ message: "Access denied, you are not an admin" });
      return;
    }
    const posts = await db.Post.findAll({
      attributes: { exclude: ["user_id"] },
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["id", "username", "profile_visibility"],
        },
      ],
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

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
      res.status(404).json({ message: "Post not found" });
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
): Promise<void> => {
  try {
    const { content, caption } = req.body;

    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "Unauthorized. Please log in." });
      return;
    }

    if (!content && !caption) {
      res
        .status(400)
        .json({ message: "Either 'content' or 'caption' is required." });
      return;
    }

    const post = await db.Post.create({
      user_id: req.user.id,
      content,
      caption,
    });

    res.status(201).json({ message: "Post created successfully.", post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { content, caption } = req.body;
    if (!content && !caption) {
      res.status(400).json({
        message:
          "At least one field ('content' or 'caption') is required to update.",
      });
      return;
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
      res.status(404).json({ message: "Post not found" });
    }
    await post?.update({
      content,
      caption,
    });
    res.json({ message: "Post updated successfully.", post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deletedPost = await Post.destroy({ where: { id } });

    res.status(201).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

export { createPost, getAllPosts, getPostById, deletePost, updatePost };
