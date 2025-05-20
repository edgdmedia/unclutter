'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    await queryInterface.bulkInsert('Users', [{
      id: adminId,
      email: 'admin@unclutter.app',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    
    // Create admin profile
    await queryInterface.bulkInsert('Profiles', [{
      id: uuidv4(),
      userId: adminId,
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'System Admin',
      preferences: JSON.stringify({}),
      enabledModules: JSON.stringify({
        journal: true,
        moodTracker: true,
        planner: true,
        expenseManager: true,
        bookReader: true
      }),
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the admin user (cascade delete will remove the profile)
    await queryInterface.bulkDelete('Users', { email: 'admin@unclutter.app' });
  }
};
