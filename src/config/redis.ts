import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

let hasLoggedError = false;

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully!");
  } catch (error: any) {
    if (!hasLoggedError) {
      console.error("❌ Redis connection failed:", error.message);
      hasLoggedError = true;
    }
  }
})();

redisClient.on("error", (err) => {
  if (!hasLoggedError) {
    console.error("❌ Redis Client Error:", err);
    hasLoggedError = true;
  }
});

export default redisClient;
