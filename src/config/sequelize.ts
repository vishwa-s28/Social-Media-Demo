import * as dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import config from "./database";
import { CONFIG_ERROR } from "../constants/error.constant";

const env: string = process.env.NODE_ENV || "development";
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`${CONFIG_ERROR.SEQUELIZE_CONFIG} ${env}`);
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

export default sequelize;
