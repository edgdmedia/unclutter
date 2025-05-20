'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FormResponses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      formId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Forms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      sessionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Sessions',
          key: 'id',
        },
        onDelete: 'SET NULL',
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
      responses: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('FormResponses');
  },
};
