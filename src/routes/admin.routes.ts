import express from "express";
import { getAllPosts } from "../controllers/admin.controller";
import { ADMIN } from "../constants/endpoint.constant";

const router = express.Router();

router.get(ADMIN.POSTS, getAllPosts);

export default router;
