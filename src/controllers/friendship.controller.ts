import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import sendNotification from "../config/webpush";
const { Friendship } = db;
interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const createFriendship = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user?.id;
    const { friend_id } = req.body;
    const friendship = await Friendship.create({
      user_id: user,
      friend_id,
    });
    const friendshipId = friendship.getDataValue("id");
    const friendshipWithFriend = await Friendship.findOne({
      where: { id: friendshipId },
      attributes: { exclude: ["user_id", "friend_id"] },
      include: [
        {
          model: db.User,
          as: "Friend",
          attributes: ["id", "username", "email"],
        },
        {
          model: db.User,
          as: "Initiator",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    await sendNotification(friend_id, {
      title: "Friend Request",
      body: `You have a new friend request from ${req.user?.email}!`,
    });
    res.status(201).json(friendshipWithFriend);
  } catch (err) {
    next(err);
  }
};

const getUserFriendships = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user?.id;
    const friendship = await Friendship.findAll({
      where: { user_id: user },
      attributes: { exclude: ["user_id", "friend_id"] },
      include: [
        {
          model: db.User,
          as: "Friend",
          attributes: ["id", "username", "email"],
        },
        {
          model: db.User,
          as: "Initiator",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    res.status(200).json(friendship);
  } catch (err) {
    next(err);
  }
};

const getFriendship = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user?.id;
    const { friend_id } = req.body;

    const friendship = await Friendship.findOne({
      where: { user_id: user, friend_id },
      attributes: { exclude: ["user_id", "friend_id"] },
      include: [
        {
          model: db.User,
          as: "Friend",
          attributes: ["id", "username", "email"],
        },
        {
          model: db.User,
          as: "Initiator",
          attributes: ["id", "username", "email"],
        },
      ],
    });
    res.status(200).json(friendship);
  } catch (err) {
    next(err);
  }
};

const updateFriendship = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const [updatedCount] = await Friendship.update(
      { status },
      { where: { id } }
    );
    if (updatedCount === 0) {
      res.status(404).json({ message: "Friendship not found or not updated" });
    }
    res.status(200).json({ message: "status updated successfully", status });
  } catch (err) {
    next(err);
  }
};

const deleteFriendship = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const friendship = await Friendship.findByPk(id);
    if (!friendship) {
      res.status(404).json({ message: "Friendship not found" });
      return;
    }
    await friendship?.destroy();
    res.status(200).json({ message: "Friendship deleted successfully" });
    return;
  } catch (err) {
    next(err);
  }
};

export {
  createFriendship,
  getUserFriendships,
  getFriendship,
  updateFriendship,
  deleteFriendship,
};
