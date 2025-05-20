'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the assignment status enum type
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_ResourceAssignments_status" AS ENUM ("assigned", "viewed", "completed")'
    ).catch(error => {
      console.log('Note: enum_ResourceAssignments_status may already exist');
    });

    // Create the ResourceAssignments table
    await queryInterface.createTable('ResourceAssignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      resourceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Resources',
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
      assignedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('assigned', 'viewed', 'completed'),
        allowNull: false,
        defaultValue: 'assigned',
      },
      notes: {
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
    await queryInterface.dropTable('ResourceAssignments');
    
    // Drop the enum type if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ResourceAssignments_status"').catch(() => {});
  },
};
