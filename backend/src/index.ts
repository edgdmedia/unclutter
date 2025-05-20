import dotenv from 'dotenv';
import { sequelize } from './models';
import app from './app';
import config from './config/env.config';
import { NotificationSchedulerService } from './services/notification-scheduler.service';

// Load environment variables
dotenv.config();

const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Start server
async function startServer(): Promise<void> {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database models
    console.log('Synchronizing database models...');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Start notification scheduler if enabled
      if (config.notification.schedulerEnabled) {
        console.log(`Starting notification scheduler with ${config.notification.schedulerInterval} minute interval`);
        NotificationSchedulerService.startScheduler(config.notification.schedulerInterval);
      }
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error instanceof Error ? error.message : 'Unknown error');
    console.log('Starting server without database synchronization...');
    
    // Start Express server anyway to allow for API endpoints that don't require database
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without database connection)`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Warning: Database-dependent features will not work until database connection is established');
    });
  }
}

startServer();
