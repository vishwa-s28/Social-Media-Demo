import { Request, Response } from "express";
import db from "../models";
import { Op } from "sequelize";

const { Chat } = db;
interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const sendMessage = async (req: CustomRequest, res: Response) => {
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
      attributes: { exclude: ["sender_id", "receiver_id"] }, // Exclude fields
      include: [
        {
          model: db.User,
          as: "Sender",
          attributes: ["id", "username", "profile_visibility"], // Specific Sender fields
        },
        {
          model: db.User,
          as: "Receiver",
          attributes: ["id", "username", "profile_visibility"], // Specific Receiver fields
        },
      ],
    });
    res.status(201).json(savedMessage);
    return;
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
    return;
  }
};

export const getChatHistory = async (req: CustomRequest, res: Response) => {
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
      attributes: {
        exclude: ["sender_id", "receiver_id", "updatedAt"],
      },
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
    return;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
    return;
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  const messageId = req.params.id;
  const { status, message } = req.body;

  try {
    const messageData = await Chat.findByPk(messageId);

    if (!messageData) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    const updatedMessage = await messageData.update({ status, message });
    res
      .status(200)
      .json({ message: "Status updated successfully", updatedMessage });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
    return;
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Chat.destroy({ where: { id } });

    if (!deleted) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.status(200).json({ message: "Message deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
    return;
  }
};
