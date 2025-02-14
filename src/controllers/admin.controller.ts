import { Request, Response, NextFunction } from "express";
import db from "../models";
import AppError from "../utils/error-helper";
import { ADMIN_ERRORS } from "../constants/error.constant";
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
      throw new AppError(ADMIN_ERRORS.ACCESS_DENIED, 401);
    }
    const posts = await Post.findAll({
      attributes: { exclude: ["user_id", "createdAt", "updatedAt"] },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["id", "username", "profile_visibility"],
        },
        {
          model: db.Comment,
          as: "comments",
          attributes: ["id", "content"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "username"],
            },
            {
              model: db.Like,
              as: "commentLikes",
              attributes: ["id"],
              include: [
                {
                  model: db.User,
                  //   as: "liker",
                  attributes: ["id", "username"],
                },
              ],
            },
          ],
        },
        {
          model: db.Tag,
          as: "taggedUser",
          attributes: ["id"],
          include: [
            {
              model: db.User,
              as: "tagger",
              attributes: ["id", "username"],
            },
          ],
        },
        {
          model: db.Like,
          as: "postLikes",
          attributes: ["id"],
          include: [
            {
              model: db.User,
              //   as: "liker",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export { getAllPosts };
