import express from "express";
import {
  sendMessage,
  getChatHistory,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/chat.controller";
import { CHAT } from "../constants/endpoint.constant";

const router = express.Router();

router.post(CHAT.SEND, sendMessage);
router.get(CHAT.HISTORY, getChatHistory);
router.patch(CHAT.MESSAGE, updateMessageStatus);
router.delete(CHAT.MESSAGE, deleteMessage);

export default router;
