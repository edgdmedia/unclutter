require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'unclutter',
    password: process.env.DB_PASSWORD || 'eNlZrUPhJatXWN0',
    database: process.env.DB_NAME || 'unclutter_api',
    host: process.env.DB_HOST || 'localhost',
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
    }
  },
};
