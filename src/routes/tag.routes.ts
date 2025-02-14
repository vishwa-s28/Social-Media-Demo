import express from "express";
import { tagUserInComment, tagUserInPost } from "../controllers/tag.controller";
import { TAG } from "../constants/endpoint.constant";

const router = express.Router();

router.post(TAG.POST, tagUserInPost);
router.post(TAG.COMMENT, tagUserInComment);

export default router;
