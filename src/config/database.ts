import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

const env: string = (process.env.NODE_ENV || 'development') as string;
const username: string = process.env.DB_USERNAME || 'user';
const password: string = process.env.DB_PASSWORD || 'pass';
const database: string = process.env.DB_NAME || 'social_media';
const host: string = process.env.DB_HOST || 'database';
const port: number = Number(process.env.DB_PORT) || 5432;
const dialect: Dialect = 'postgres';

if (!username || !password || !database || !host) {
    throw new Error('Database configuration is incomplete. Check your environment variables.');
}

const config = {
    dialect,
    username,
    password,
    database,
    host,
    port,
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 60000,
        idle: 10000,
    },
};

const dbConfigs = {
    [env]: config,
};

export = dbConfigs;
