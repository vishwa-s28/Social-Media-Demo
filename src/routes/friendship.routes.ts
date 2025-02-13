import express from "express";
import {
  createFriendship,
  deleteFriendship,
  getFriendship,
  getUserFriendships,
  updateFriendship,
} from "../controllers/friendship.controller";

const router = express.Router();

router.post("/", createFriendship);
router.get("/all_friends", getUserFriendships);
router.get("/", getFriendship);
router.put("/:id", updateFriendship);
router.delete("/:id", deleteFriendship);

export default router;
