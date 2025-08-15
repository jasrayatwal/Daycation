const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Trip, Activity, BudgetItem } = require('../../db/models');

const router = express.Router();

// Get all trips for the current user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = req.user.id;

    const trips = await Trip.findAll({
      where: {
        userId: user
      },
      include: [
        {
          model: Activity,
          as: 'activities',
          include: [
            {
              model: BudgetItem,
              as: 'budgetItem'
            }
          ]
        },
        {
          model: BudgetItem,
          as: 'budgetItems'
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{model: Activity, as: 'activities'}, 'orderNumber', 'ASC']
      ]
    });

    return res.status(200).json({trips});
  } catch (error) {
    console.error('Error getting current user trips:', error);
    next(error);
  }
});

//get a specific trip by its id
router.get('/:tripId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.tripId;

    const trip = await Trip.findOne({
      where: {
        id: tripId,
        userId: userId
      },
      include: [
        {
          model: Activity,
          as: 'activities',
          include: [
            {
              model: BudgetItem,
              as: 'budgetItem'
            }
          ]
        },
        {
          model: BudgetItem,
          as: 'budgetItems'
        }
      ],
      order: [
        [{model: Activity, as: 'activities'}, 'orderNumber', 'ASC']
      ]
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip couldn't be found"
      });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error(`Error getting trip ${tripId}:`, error);
    next(error);
  }
});

// create a new trip
// update a trip by its id
// delete a trip by its id

module.exports = router;
