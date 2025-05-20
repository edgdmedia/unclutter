'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the form type enum type
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_Forms_type" AS ENUM ("pre_session", "in_session", "post_session", "assessment", "custom")'
    ).catch(error => {
      console.log('Note: enum_Forms_type may already exist');
    });

    // Create the Forms table
    await queryInterface.createTable('Forms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('pre_session', 'in_session', 'post_session', 'assessment', 'custom'),
        allowNull: false,
      },
      fields: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable('Forms');
    
    // Drop the enum type if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Forms_type"').catch(() => {});
  },
};
