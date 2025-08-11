'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tripId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Trips',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      orderNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('place', 'meal', 'event', 'transport', 'break', 'shopping', 'outdoor', 'cultural', 'history', 'custom'),
        allowNull: false,
        defaultValue: 'custom'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      lng: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      durationMin: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      transportType: {
        type: Sequelize.ENUM('walk', 'transit', 'drive', 'ridehail'),
        allowNull: true
      },
      costEstimate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      locationUrl: {
        type: Sequelize.STRING(1000),
        allowNull: true
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
    options.tableName = 'Activities';
    return queryInterface.dropTable(options);
  }
};
