import express from "express";
import {
  addComment,
  deleteComment,
  getAllCommentByUser,
  getCommentById,
  updateComment,
} from "../controllers/comment.controller";
import { COMMENTS } from "../constants/endpoint.constant";

const router = express.Router();

router.get(COMMENTS.BY_USER, getAllCommentByUser);
router.get(COMMENTS.ON_POST_ID, getCommentById);
router.post(COMMENTS.ON_POST, addComment);
router.put(COMMENTS.ON_POST_ID, updateComment);
router.delete(COMMENTS.DELETE_ON_POST, deleteComment);

export default router;
