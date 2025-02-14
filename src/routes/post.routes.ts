import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  updatePost,
} from "../controllers/post.controller";
import { POST } from "../constants/endpoint.constant";

const router = express.Router();

router.get(POST.BY_ID, getPostById); //query: userId, params: postId
router.post(POST.BASE, createPost);
router.put(POST.BY_ID, updatePost);
router.delete(POST.BY_ID, deletePost);

export default router;
