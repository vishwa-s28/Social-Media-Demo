import express from "express";
import {
  addComment,
  deleteComment,
  getAllCommentByUser,
  getCommentById,
  updateComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.get("/by_user", getAllCommentByUser);
router.get("/on_post/:id", getCommentById);
router.post("/on_post", addComment);
router.put("/on_post/:id", updateComment);
router.delete("/delete_on_post/:id", deleteComment);

export default router;
