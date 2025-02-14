import { NextFunction, Request, Response } from "express";
import db from "../models";
import { Op } from "sequelize";
import AppError from "../utils/error-helper";
import { CHAT_ERRORS } from "../constants/error.constant";

const { Chat } = db;

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const sendMessage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user?.id;

  try {
    const newMessage = await Chat.create({
      sender_id,
      receiver_id,
      message,
    });

    const messageId = newMessage.getDataValue("id");

    const savedMessage = await Chat.findOne({
      where: { id: messageId },
      attributes: { exclude: ["sender_id", "receiver_id"] },
      include: [
        {
          model: db.User,
          as: "Sender",
          attributes: ["id", "username", "profile_visibility"],
        },
        {
          model: db.User,
          as: "Receiver",
          attributes: ["id", "username", "profile_visibility"],
        },
      ],
    });

    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const sender_id = req.user?.id;
  const { receiver_id } = req.body;

  try {
    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      attributes: { exclude: ["sender_id", "receiver_id", "updatedAt"] },
      include: [
        {
          model: db.User,
          as: "Sender",
          attributes: ["username"],
        },
        {
          model: db.User,
          as: "Receiver",
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const messageId = req.params.id;
  const { status, message } = req.body;

  try {
    const messageData = await Chat.findByPk(messageId);

    if (!messageData) {
      throw new AppError(CHAT_ERRORS.MESSAGE_NOT_FOUND, 404);
    }

    const updatedMessage = await messageData.update({ status, message });

    res.status(200).json({
      message: CHAT_ERRORS.STATUS_UPDATE_SUCCESS,
      updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deleted = await Chat.destroy({ where: { id } });

    if (!deleted) {
      throw new AppError(CHAT_ERRORS.MESSAGE_NOT_FOUND, 404);
    }

    res.status(200).json({ message: CHAT_ERRORS.MESSAGE_DELETE_SUCCESS });
  } catch (error) {
    next(error);
  }
};
