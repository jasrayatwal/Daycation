const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Trip, Activity, BudgetItem } = require('../../db/models');

const router = express.Router();

// Get all activities for a trip by id (make sure user is logged in, and they are trying to get to their trip activities not someone else)
router.get('/:tripId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.tripId;

    const trip = await Trip.findOne({
      where: {
        id: tripId,
        userId: userId
      }
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip couldn't be found"
      });
    }

    const activities = await Activity.findAll({
      where: {
        tripId: tripId
      },
      include: [
        {
          model: BudgetItem,
          as: 'budgetItem'
        }
      ],
      order: [
        ['orderNumber', 'ASC']
      ]
    });

    return res.status(200).json({activities});
  } catch (error) {
    console.error(`Error getting activities for trip ${tripId}:`, error);
    next(error);
  }
});

module.exports = router;
