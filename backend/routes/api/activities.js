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
})

//create activities
router.post('/bulk', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {tripId, activities = []} = req.body;

    const trip = await Trip.findOne({
      where: {
        id: tripId,
        userId: userId
      }
    })

    if (!trip) {
      return res.status(404).json({
        message: "Trip couldn't be found"
      })
    }

    if (activities.length === 0) {
      return res.status(400).json({
        message: "No activities provided"
      })
    }

    const createdActivities = await Promise.all( //wait for all
      activities.map((activity, index) =>
        Activity.create({
          tripId: tripId,
          orderNumber: activity.orderNumber,
          type: activity.type,
          title: activity.title,
          address: activity.address,
          lat: activity.lat,
          lng: activity.lng,
          startTime: activity.startTime,
          endTime: activity.endTime,
          durationMin: activity.durationMin,
          transportType: activity.transportType,
          costEstimate: activity.costEstimate,
          notes: activity.notes,
          status: 'pending'
        })
      )
    );

    return res.status(201).json({
      message: "Activities created successfully",
      activities: createdActivities
    });

  } catch (error) {
    console.error('Error creating activities:', error);
    next(error);
  }
})

//update activity
router.put('/:activityId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const activityId = req.params.activityId;
    const {
      orderNumber,
      type,
      title,
      address,
      lat,
      lng,
      startTime,
      endTime,
      durationMin,
      transportType,
      costEstimate,
      notes,
      status
    } = req.body;

    const activity = await Activity.findOne({
      where: {id: activityId},
      include: [
        {
          model: Trip,
          as: 'trip',
          where: {userId: userId}
        }
      ]
    })

    if (!activity) {
      return res.status(404).json({
        message: "Activity couldn't be found"
      })
    }

    await activity.update({
      orderNumber: orderNumber || activity.orderNumber,
      type: type || activity.type,
      title: title || activity.title,
      address: address || activity.address,
      lat: lat || activity.lat,
      lng: lng || activity.lng,
      startTime: startTime || activity.startTime,
      endTime: endTime || activity.endTime,
      durationMin: durationMin || activity.durationMin,
      transportType: transportType || activity.transportType,
      costEstimate: costEstimate || activity.costEstimate,
      notes: notes || activity.notes,
      status: status || activity.status
    });

    const updatedActivity = await Activity.findOne({
      where: {id: activityId},
      include: [
        {
          model: BudgetItem,
          as: 'budgetItem'
        }
      ]
    })

    return res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(`Error updating activity ${activityId}:`, error);
    next(error);
  }
})

//delete an activity
router.delete('/:activityId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const activityId = req.params.activityId;

    const activity = await Activity.findOne({
      where: { id: activityId },
      include: [
        {
          model: Trip,
          as: 'trip',
          where: { userId: userId }
        }
      ]
    })

    if (!activity) {
      return res.status(404).json({message: "Activity couldn't be found"});
    }

    await activity.destroy();

    return res.status(200).json({
      message: "Activity successfully deleted"
    })
  } catch (error) {
    console.error(`Error deleting activity ${activityId}:`, error);
    next(error);
  }
});

module.exports = router;
