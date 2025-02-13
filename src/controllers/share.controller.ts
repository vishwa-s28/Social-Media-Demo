import { Request, Response, NextFunction } from "express";
import db from "../models/index";
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
    const post = await Post.findByPk(post_id);
    if (!post) {
      res.status(404).send({ message: "Post not found" });
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
    res.send({ message: "Post shared successfully", shareWithDetails });
  } catch (err) {
    next(err);
  }
};

export { sharePost };
