'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.Trip, {
        foreignKey: 'tripId',
        as: 'trip'
      })

      Activity.hasOne(models.BudgetItem, {
        foreignKey: 'activityId',
        as: 'budgetItem'
      })
    }
  }
  Activity.init({
    tripId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trips',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    type: {
      type: DataTypes.ENUM('place', 'meal', 'event', 'transport', 'break', 'shopping', 'outdoor', 'cultural', 'history', 'custom'),
      allowNull: false,
      defaultValue: 'custom',
      validate: {
        isIn: [['place', 'meal', 'event', 'transport', 'break', 'shopping', 'outdoor', 'cultural', 'history', 'custom']]
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        len: [1, 500],
        notEmpty: true
      }
    },
    lat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    durationMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    transportType: {
      type: DataTypes.ENUM('walk', 'transit', 'drive', 'ridehail'),
      allowNull: true,
      validate: {
        isIn: [['walk', 'transit', 'drive', 'ridehail']]
      }
    },
    costEstimate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    locationUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'active'),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'active']]
      }
    }
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};
