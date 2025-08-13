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
        [{ model: Activity, as: 'activities' }, 'orderNumber', 'ASC']
      ]
    });

    return res.status(200).json({ trips });
  } catch (error) {
    console.error('Error getting current user trips:', error);
    next(error);
  }
});

module.exports = router;
