import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  updatePost,
} from "../controllers/post.controller";

const router = express.Router();

router.get("/:id", getPostById); //query: userId, params: postId
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
