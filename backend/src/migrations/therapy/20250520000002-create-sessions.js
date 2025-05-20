'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create the session status enum type
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_Sessions_status" AS ENUM ("scheduled", "completed", "canceled", "rescheduled", "no_show")'
    ).catch(error => {
      // Type might already exist, which is fine
      console.log('Note: enum_Sessions_status may already exist');
    });

    // Create the session type enum type
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_Sessions_type" AS ENUM ("initial", "regular", "follow_up", "emergency")'
    ).catch(error => {
      console.log('Note: enum_Sessions_type may already exist');
    });

    // Create the session format enum type
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_Sessions_format" AS ENUM ("video", "audio", "chat", "in_person", "hybrid")'
    ).catch(error => {
      console.log('Note: enum_Sessions_format may already exist');
    });

    // Create the Sessions table
    await queryInterface.createTable('Sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      therapistId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Therapists',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      clientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'completed', 'canceled', 'rescheduled', 'no_show'),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      type: {
        type: Sequelize.ENUM('initial', 'regular', 'follow_up', 'emergency'),
        allowNull: false,
      },
      format: {
        type: Sequelize.ENUM('video', 'audio', 'chat', 'in_person', 'hybrid'),
        allowNull: false,
      },
      privateNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sharedNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meta: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Sessions');
    
    // Drop the enum types if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Sessions_status"').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Sessions_type"').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Sessions_format"').catch(() => {});
  },
};
