'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the resource type enum type
    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_Resources_type" AS ENUM ("pdf", "video", "audio", "link", "image", "text", "other")'
    ).catch(error => {
      console.log('Note: enum_Resources_type may already exist');
    });

    // Create the Resources table
    await queryInterface.createTable('Resources', {
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('pdf', 'video', 'audio', 'link', 'image', 'text', 'other'),
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
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
    await queryInterface.dropTable('Resources');
    
    // Drop the enum type if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Resources_type"').catch(() => {});
  },
};
