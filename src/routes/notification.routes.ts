import express from "express";
import {
  userSubscription,
  userUnsubscription,
} from "../controllers/notification.controller";
const router = express.Router();

router.post("/enable", userSubscription);
router.post("/disable", userUnsubscription);

export default router;
