import express, { Express, Request, Response, NextFunction } from "express";
import authRoutes from "./auth.routes";
import postRoutes from "./post.routes";
import commentRoutes from "./comment.routes";
import friendshipRoutes from "./friendship.routes";
import tagRoutes from "./tag.routes";
import likeRoutes from "./like.routes";
import blockRoutes from "./block.routes";
import shareRoutes from "./share.routes";
import * as auth from "../middlewares/auth.middleware";
import chatRoutes from "./chat.routes";
// import checkPrivacy from "../middlewares/checkPrivacy.middleware";
import cacheMiddleware from "../middlewares/cacheMiddleware";
const router = express.Router();

router.use("/auth", authRoutes);
// router.use(
//   "/admin",
//   auth.authenticateToken,
//   auth.authorizeRole(["admin"]),
//   authRoutes
// );
router.use("/posts", auth.authenticateToken, cacheMiddleware, postRoutes);
router.use("/comments", auth.authenticateToken, commentRoutes);
router.use("/friendship", auth.authenticateToken, friendshipRoutes);
router.use("/tag", auth.authenticateToken, tagRoutes);
router.use("/like", auth.authenticateToken, likeRoutes);
router.use("/block", auth.authenticateToken, blockRoutes);
router.use("/share", auth.authenticateToken, shareRoutes);
router.use("/chat", auth.authenticateToken, chatRoutes);

export default router;
