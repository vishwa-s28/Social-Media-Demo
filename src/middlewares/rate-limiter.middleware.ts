import rateLimit from "express-rate-limit";
import { GENERAL_MESSAGES } from "../constants/error.constant";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: GENERAL_MESSAGES.RATE_LIMIT_ERROR,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;
