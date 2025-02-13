import express from "express";
import { sharePost } from "../controllers/share.controller";

const router = express.Router();

router.post("/post", sharePost);

export default router;
