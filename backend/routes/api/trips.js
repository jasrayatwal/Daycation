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
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      date,
      location,
      refLat,
      refLng,
      tripRadius,
      startTime,
      endTime,
      groupSize,
      primaryTransportation,
      budget,
      tripPace,
      tripType,
      notes,
      activities = []
    } = req.body;

    const trip = await Trip.create({
      userId,
      name,
      date: date,
      location,
      refLat,
      refLng,
      tripRadius: tripRadius || 10.0,
      startTime,
      endTime,
      groupSize,
      primaryTransportation,
      budget,
      tripPace: tripPace,
      tripType,
      notes,
      status: 'pending'
    })

    if (activities.length > 0) {
      const activitiesData = {
        tripId: trip.id,
        activities: activities
      }

      await Promise.all( //wait for activities
        activities.map((activity, index) =>
          Activity.create({
            tripId: trip.id,
            orderNumber: activity.orderNumber || index + 1,
            type: activity.type,
            title: activity.title,
            address: activity.address,
            lat: activity.lat,
            lng: activity.lng,
            startTime: activity.startTime,
            endTime: activity.endTime,
            durationMin: activity.durationMin,
            transportType: activity.transportType,
            costEstimate: activity.costEstimate || 0,
            notes: activity.notes,
            status: 'pending'
          })
        )
      )
    }

    const completeTripWithActivities = await Trip.findOne({
      where: {id: trip.id},
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

    return res.status(201).json(completeTripWithActivities);
  } catch (error) {
    console.error('Error creating trip:', error);
    next(error);
  }
})

// update a trip by its id
router.put('/:tripId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.tripId;
    const {
      name,
      date,
      location,
      refLat,
      refLng,
      tripRadius,
      startTime,
      endTime,
      groupSize,
      primaryTransportation,
      budget,
      tripPace,
      tripType,
      notes,
      status
    } = req.body;

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

    await trip.update({
      name: name || trip.name,
      date: date || trip.date,
      location: location || trip.location,
      refLat: refLat || trip.refLat,
      refLng: refLng || trip.refLng,
      tripRadius: tripRadius || trip.tripRadius,
      startTime: startTime || trip.startTime,
      endTime: endTime || trip.endTime,
      groupSize: groupSize || trip.groupSize,
      primaryTransportation: primaryTransportation || trip.primaryTransportation,
      budget: budget || trip.budget,
      tripPace: tripPace || trip.tripPace,
      tripType: tripType || trip.tripType,
      notes: notes || trip.notes,
      status: status || trip.status
    })

    const updatedTrip = await Trip.findOne({
      where: {id: tripId},
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

    return res.status(200).json(updatedTrip);
  } catch (error) {
    console.error(`Error updating trip ${tripId}:`, error);
    next(error);
  }
})

// delete a trip by its id
router.delete('/:tripId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.tripId;

    const trip = await Trip.findOne({
      where: {
        id: tripId,
        userId: userId
      }
    })

    if (!trip) {
      return res.status(404).json({
        message: "Trip couldn't be found"
      });
    }

    await trip.destroy();

    return res.status(200).json({
      message: "Trip successfully deleted"
    });
  } catch (error) {
    console.error(`Error deleting trip ${tripId}:`, error);
    next(error);
  }
})

module.exports = router;
