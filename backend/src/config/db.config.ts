import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  logging: boolean | ((sql: string, timing?: number) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  dialectOptions?: {
    [key: string]: any;
  };
}

interface Config {
  [key: string]: DbConfig;
}

const config: Config = {
  development: {
    username: process.env.DB_USER || 'unclutter',
    password: process.env.DB_PASSWORD || 'eNlZrUPhJatXWN0',
    database: process.env.DB_NAME || 'unclutter_api',
    host: process.env.DB_HOST || 'server.edgdhosting.xyz',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
      connectTimeout: 60000
    }
  },
  test: {
    username: process.env.DB_USER || 'unclutter',
    password: process.env.DB_PASSWORD || 'eNlZrUPhJatXWN0',
    database: process.env.DB_NAME || 'unclutter_api',
    host: process.env.DB_HOST || 'server.edgdhosting.xyz',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER || 'unclutter',
    password: process.env.DB_PASSWORD || 'eNlZrUPhJatXWN0',
    database: process.env.DB_NAME || 'unclutter_api',
    host: process.env.DB_HOST || 'server.edgdhosting.xyz',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
      // Enable SSL if needed
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    }
  },
};

// This makes the config work with both TypeScript imports and Sequelize CLI
export default config;
module.exports = config;
