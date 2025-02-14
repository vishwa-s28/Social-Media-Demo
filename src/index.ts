import express, { Express } from "express";
import sequelize from "./config/sequelize";
import { initSocket } from "./config/socket";
import generalRoutes from "./routes/index";
import dotenv from "dotenv";
import db from "./models/index";
import { createServer } from "http";
import path from "path";
import notFound from "./middlewares/404";
import globalErrorHandler from "./middlewares/error-handler.middleware";
import rateLimiter from "./middlewares/rate-limiter.middleware";
import { ENDPOINTS } from "./constants/endpoint.constant";
dotenv.config();

const app: Express = express();
const PORT: number | string = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "../client")));

app.use(express.json());
app.use(rateLimiter);
app.use(ENDPOINTS.BASE, generalRoutes);
app.use(notFound);
app.use(globalErrorHandler);

const server = createServer(app);
initSocket(server);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");

    await db.sequelize.sync({ force: false });
    console.log("✅ All models were synchronized successfully.");

    server.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
