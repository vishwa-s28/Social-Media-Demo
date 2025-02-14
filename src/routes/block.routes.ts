import express from "express";
import { blockUser, unblockUser } from "../controllers/block.controller";
import { BLOCK } from "../constants/endpoint.constant";

const router = express.Router();

router.post(BLOCK.BASE, blockUser);
router.post(BLOCK.UNBLOCK, unblockUser);

export default router;
