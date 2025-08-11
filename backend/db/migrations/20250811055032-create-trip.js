'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      refLat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      refLng: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      tripRadius: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '09:00:00'
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '21:00:00'
      },
      groupSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 20
        }
      },
      primaryTransportation: {
        type: Sequelize.ENUM('walking', 'public_transit', 'car', 'mixed'),
        allowNull: false,
        defaultValue: 'mixed'
      },
      budget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      tripPace: {
        type: Sequelize.ENUM('relaxed', 'balanced', 'packed'),
        allowNull: false,
        defaultValue: 'balanced'
      },
      tripType: {
        type: Sequelize.ENUM('family', 'friends', 'shopping', 'nature', 'foodie', 'adventure', 'cultural', 'history', 'romantic', 'custom'),
        allowNull: false,
        defaultValue: 'custom'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'active'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Trips';
    return queryInterface.dropTable(options);
  }
};
