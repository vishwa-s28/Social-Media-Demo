import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = req.originalUrl;

  if (["GET"].includes(req.method)) {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Response from cache");
      res.status(200).json(JSON.parse(cachedData));
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      redisClient.set(cacheKey, JSON.stringify(body), { EX: 3600 });
      return originalJson(body);
    };
  } else if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const pattern = `*${req.baseUrl}*`;
    const keys = await redisClient.keys(pattern);

    if (keys.length) {
      await Promise.all(keys.map((key) => redisClient.del(key)));
      console.log(`Cache invalidated for keys: ${keys.join(", ")}`);
    }
  }

  next();
};

export default cacheMiddleware;
