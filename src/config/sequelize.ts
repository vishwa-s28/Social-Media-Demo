import * as dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import config from "./database";

const env: string = process.env.NODE_ENV || "development";
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`Database configuration not found for environment: ${env}`);
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

export default sequelize;
