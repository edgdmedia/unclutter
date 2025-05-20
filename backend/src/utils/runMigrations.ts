import { Sequelize } from 'sequelize';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import config from '../config/db.config';

// Load environment variables
dotenv.config();

// Get environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

async function testConnection() {
  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: false,
      dialectOptions: dbConfig.dialectOptions,
    }
  );

  try {
    console.log(`Attempting to connect to database ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}...`);
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  } finally {
    await sequelize.close();
  }
}

function runMigrations() {
  console.log('Running migrations...');
  exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Migration stderr: ${stderr}`);
      return;
    }
    console.log(`Migration stdout: ${stdout}`);
    console.log('Migrations completed successfully.');
    
    // Run seeders after successful migration
    console.log('Running seeders...');
    exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
      if (error) {
        console.error(`Seeder error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Seeder stderr: ${stderr}`);
        return;
      }
      console.log(`Seeder stdout: ${stdout}`);
      console.log('Seeders completed successfully.');
    });
  });
}

async function main() {
  const connected = await testConnection();
  if (connected) {
    runMigrations();
  } else {
    console.error('Cannot run migrations without database connection. Please check your database configuration.');
    process.exit(1);
  }
}

main();
