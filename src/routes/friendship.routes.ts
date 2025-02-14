import express from "express";
import {
  createFriendship,
  deleteFriendship,
  getFriendship,
  getUserFriendships,
  updateFriendship,
} from "../controllers/friendship.controller";
import { FRIENDSHIP } from "../constants/endpoint.constant";

const router = express.Router();

router.post(FRIENDSHIP.BASE, createFriendship);
router.get(FRIENDSHIP.ALL_FRIENDS, getUserFriendships);
router.get(FRIENDSHIP.BASE, getFriendship);
router.put(FRIENDSHIP.FRIENDSHIP_ID, updateFriendship);
router.delete(FRIENDSHIP.FRIENDSHIP_ID, deleteFriendship);

export default router;
