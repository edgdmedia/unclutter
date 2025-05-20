import dotenv from 'dotenv';
import mysql from 'mysql2';

// Load environment variables
dotenv.config();

// Database configuration without database name
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Create connection to MySQL server (without specifying a database)
const connection = mysql.createConnection({
  host: DB_HOST || 'localhost',
  port: parseInt(DB_PORT || '3306', 10),
  user: DB_USER || 'root',
  password: DB_PASSWORD || '',
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    process.exit(1);
  }
  
  console.log('Connected to MySQL server');
  
  // Create database if it doesn't exist
  connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME || 'unclutter'}`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
    } else {
      console.log(`Database '${DB_NAME || 'unclutter'}' created or already exists`);
    }
    
    // Close connection
    connection.end();
  });
});
