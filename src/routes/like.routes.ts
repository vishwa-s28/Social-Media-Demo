import express from "express";
import { likeComment, likePost } from "../controllers/like.controller";
import { LIKE } from "../constants/endpoint.constant";
const router = express.Router();

router.post(LIKE.POST, likePost);
router.post(LIKE.COMMENT, likeComment);

export default router;
