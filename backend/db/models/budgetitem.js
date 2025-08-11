'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BudgetItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BudgetItem.belongsTo(models.Activity, {
        foreignKey: 'activityId',
        as: 'activity'
      })

      BudgetItem.belongsTo(models.Trip, {
        foreignKey: 'tripId',
        as: 'trip'
      })
    }
  }
  BudgetItem.init({
    tripId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trips',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Activities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
        notEmpty: true
      }
    },
    category: {
      type: DataTypes.ENUM('food', 'transport', 'lodging', 'entertainment', 'shopping', 'fees', 'misc'),
      allowNull: false,
      defaultValue: 'misc',
      validate: {
        isIn: [['food', 'transport', 'lodging', 'entertainment', 'shopping', 'fees', 'misc']]
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BudgetItem',
  });
  return BudgetItem;
};
