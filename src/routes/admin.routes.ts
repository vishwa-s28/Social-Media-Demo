import express from "express";
import { getAllPosts } from "../controllers/admin.controller";

const router = express.Router();

router.get("/posts", getAllPosts);

export default router;
