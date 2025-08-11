'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })

      Trip.hasMany(models.Activity, {
        foreignKey: 'tripId',
        as: 'activities'
      })

      Trip.hasMany(models.BudgetItem, {
        foreignKey: 'tripId',
        as: 'budgetItems'
      })
    }
  }
  Trip.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
        notEmpty: true
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true
      }
    },
    refLat: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
    },
    refLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    tripRadius: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 1.00,
        max: 999.99
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '09:00:00',
      validate: {
        notEmpty: true
      }
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '21:00:00',
      validate: {
        notEmpty: true
      }
    },
    groupSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 20
      }
    },
    primaryTransportation: {
      type: DataTypes.ENUM('walking', 'public_transit', 'car', 'mixed'),
      allowNull: false,
      defaultValue: 'mixed',
      validate: {
        isIn: [['walking', 'public_transit', 'car', 'mixed']]
      }
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    tripPace: {
      type: DataTypes.ENUM('relaxed', 'balanced', 'packed'),
      allowNull: false,
      defaultValue: 'balanced',
      validate: {
        isIn: [['relaxed', 'balanced', 'packed']]
      }
    },
    tripType: {
      type: DataTypes.ENUM('family', 'friends', 'shopping', 'nature', 'foodie', 'adventure', 'cultural', 'history', 'romantic', 'custom'),
      allowNull: false,
      defaultValue: 'custom',
      validate: {
        isIn: [['family', 'friends', 'shopping', 'nature', 'foodie', 'adventure', 'cultural', 'history', 'romantic', 'custom']]
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
    modelName: 'Trip',
  });
  return Trip;
};
