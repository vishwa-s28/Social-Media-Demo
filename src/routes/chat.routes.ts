import express from "express";
import {
  sendMessage,
  getChatHistory,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/chat.controller";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/history", getChatHistory);
router.patch("/message/:id", updateMessageStatus);
router.delete("/message/:id", deleteMessage);

export default router;
