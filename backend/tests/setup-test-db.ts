/**
 * Setup script for test database
 * This script creates the test database and runs migrations
 */

import dotenv from 'dotenv';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

const execPromise = util.promisify(exec);

/**
 * Run a command and log its output
 */
async function runCommand(command: string): Promise<void> {
  try {
    console.log(`Running: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Main function to set up test database
 */
async function setupTestDatabase(): Promise<void> {
  console.log('Setting up test database...');

  // Create test database
  await runCommand('NODE_ENV=test npx ts-node src/utils/createDatabase.ts');

  // Run migrations
  await runCommand('NODE_ENV=test npx sequelize-cli db:migrate');

  // Run therapy migrations
  await runCommand('NODE_ENV=test npx sequelize-cli db:migrate --migrations-path src/migrations/therapy');

  console.log('Test database setup complete!');
}

// Run setup
setupTestDatabase().catch(error => {
  console.error('Failed to set up test database:', error);
  process.exit(1);
});
