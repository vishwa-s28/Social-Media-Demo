import express from "express";
import { blockUser, unblockUser } from "../controllers/block.controller";

const router = express.Router();

router.post("/", blockUser);
router.post("/unblock", unblockUser);

export default router;
