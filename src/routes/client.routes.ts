import express from "express";
import { getPrivateKey } from "../controllers/client.controller";
import { CLIENT } from "../constants/endpoint.constant";

const router = express.Router();

router.get(CLIENT.PRIVATE_KEY, getPrivateKey);

export default router;
