import express from "express";
import {
  userSubscription,
  userUnsubscription,
} from "../controllers/notification.controller";
import { NOTIFICATIONS } from "../constants/endpoint.constant";
const router = express.Router();

router.post(NOTIFICATIONS.ENABLE, userSubscription);
router.post(NOTIFICATIONS.DISABLE, userUnsubscription);

export default router;
