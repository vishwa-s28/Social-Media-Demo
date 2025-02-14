import express from "express";
import { ENDPOINTS, CLIENT } from "../constants/endpoint.constant";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import postRoutes from "./post.routes";
import commentRoutes from "./comment.routes";
import friendshipRoutes from "./friendship.routes";
import tagRoutes from "./tag.routes";
import likeRoutes from "./like.routes";
import blockRoutes from "./block.routes";
import shareRoutes from "./share.routes";
import * as auth from "../middlewares/auth.middleware";
import chatRoutes from "./chat.routes";
import clientRoutes from "./client.routes";
import notificationRoutes from "./notification.routes";
import cacheMiddleware from "../middlewares/cache.middleware";
// import checkPrivacy from "../middlewares/checkPrivacy.middleware";

const router = express.Router();

router.use(CLIENT.CONFIG, clientRoutes);
router.use(ENDPOINTS.AUTH, authRoutes);
router.use(
  ENDPOINTS.ADMIN,
  auth.authenticateToken,
  auth.authorizeRole(["admin"]),
  adminRoutes
);
router.use(
  ENDPOINTS.POSTS,
  auth.authenticateToken,
  cacheMiddleware,
  postRoutes
);
router.use(ENDPOINTS.COMMENTS, auth.authenticateToken, commentRoutes);
router.use(ENDPOINTS.FRIENDSHIP, auth.authenticateToken, friendshipRoutes);
router.use(ENDPOINTS.TAG, auth.authenticateToken, tagRoutes);
router.use(ENDPOINTS.LIKE, auth.authenticateToken, likeRoutes);
router.use(ENDPOINTS.BLOCK, auth.authenticateToken, blockRoutes);
router.use(ENDPOINTS.SHARE, auth.authenticateToken, shareRoutes);
router.use(ENDPOINTS.CHAT, auth.authenticateToken, chatRoutes);
router.use(ENDPOINTS.NOTIFICATIONS, auth.authenticateToken, notificationRoutes);

export default router;
