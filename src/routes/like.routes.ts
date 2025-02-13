import express from "express";
import { likeComment, likePost } from "../controllers/like.controller";
const router = express.Router();

router.post("/post", likePost);
router.post("/comment", likeComment);

export default router;
