import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import sendNotification from "../config/webpush";
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
      res.status(401).json({ message: "Unauthorized. Please log in." });
      return;
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
      res.status(404).json({ message: "post not exists" });
    }
    const comment = await Comment.findAll({
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
    if (!comment) {
      res.status(404).json({ message: "Comment not found on this post" });
    }
    res.status(200).json(comment);
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
      body: `${req.user?.email} commented on your post! `,
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
      res.status(404).json({ message: "Comment not found" });
    }
    await comment?.update({ content });
    res.status(200).json({ message: "comment updated successfully", comment });
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
    if (deletedComment === 0) {
      res.status(404).json({ message: "comment not found" });
    }
    res.status(200).json({ message: "comment deleted successfully" });
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
