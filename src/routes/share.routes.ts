import express from "express";
import { sharePost } from "../controllers/share.controller";
import { SHARE } from "../constants/endpoint.constant";

const router = express.Router();

router.post(SHARE.POST, sharePost);

export default router;
