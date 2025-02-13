import express from "express";
import { tagUserInComment, tagUserInPost } from "../controllers/tag.controller";

const router = express.Router();

router.post("/post", tagUserInPost);
router.post("/comment", tagUserInComment);

export default router;
