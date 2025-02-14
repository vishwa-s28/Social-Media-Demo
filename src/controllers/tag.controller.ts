import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import sendNotification from "../config/webpush";
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
    const post = await Post.findByPk(post_id);
    if (!post) {
      res.status(404).send({ message: "Post not found" });
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
    await sendNotification(tagged_id, {
      title: "Tag in a post",
      body: `${req.user?.email} tagged you in a post!`,
    });
    res.send({ message: "User tagged successfully", tagWithDetails });
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
    const comment = await Comment.findByPk(id);
    if (!comment) {
      res.status(404).send({ message: "Comment not found" });
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
    await sendNotification(tagged_id, {
      title: "Comment on your post",
      body: `${req.user?.email} mentioned you in a comment!`,
    });
    res.send({ message: "User tagged successfully", tagWithDetails });
  } catch (err) {
    next(err);
  }
};

export { tagUserInPost, tagUserInComment };
