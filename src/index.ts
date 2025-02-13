import express, { Express } from "express";
import sequelize from "./config/sequelize";
import { initSocket } from "./config/socket";
import generalRoutes from "./routes/index";
import dotenv from "dotenv";
import db from "./models/index";
import { createServer } from "http";
dotenv.config();

const app: Express = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use("/", generalRoutes);

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
