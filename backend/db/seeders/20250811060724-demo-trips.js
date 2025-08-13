'use strict';

const { Trip } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Trips';
    await Trip.bulkCreate([
      {
        userId: 1,
        name: 'San Francisco Day Adventure',
        date: '2025-09-01',
        location: 'San Francisco, CA',
        refLat: 37.7749,
        refLng: -122.4194,
        tripRadius: 15.00,
        startTime: '09:00:00',
        endTime: '21:00:00',
        groupSize: 2,
        primaryTransportation: 'public_transit',
        budget: 250.00,
        tripPace: 'balanced',
        tripType: 'cultural',
        notes: 'Exploring Cultural SF using public transportation.',
        status: 'pending'
      },
      {
        userId: 1,
        name: 'Oakland Food Tour',
        date: '2025-09-02',
        location: 'Oakland, CA',
        refLat: 37.8044,
        refLng: -122.2712,
        tripRadius: 8.00,
        startTime: '11:00:00',
        endTime: '18:00:00',
        groupSize: 4,
        primaryTransportation: 'walking',
        budget: 180.00,
        tripPace: 'relaxed',
        tripType: 'foodie',
        notes: 'Trying out food in downtown Oakland.',
        status: 'active'
      },
      {
        userId: 2,
        name: 'Golden Gate Park Family Day',
        date: '2025-09-03',
        location: 'Golden Gate Park, San Francisco',
        refLat: 37.7694,
        refLng: -122.4862,
        tripRadius: 5.00,
        startTime: '10:00:00',
        endTime: '17:00:00',
        groupSize: 5,
        primaryTransportation: 'walking',
        budget: 120.00,
        tripPace: 'relaxed',
        tripType: 'family',
        notes: 'Family walking day at the Golden Gate Park',
        status: 'pending'
      },
      {
        userId: 2,
        name: 'Berkeley Shopping Spree',
        date: '2025-09-04',
        location: 'Berkeley, CA',
        refLat: 37.8715,
        refLng: -122.2730,
        tripRadius: 10.00,
        startTime: '12:00:00',
        endTime: '19:00:00',
        groupSize: 3,
        primaryTransportation: 'car',
        budget: 400.00,
        tripPace: 'packed',
        tripType: 'shopping',
        notes: 'Last minute shopping with friends',
        status: 'pending'
      },
      {
        userId: 3,
        name: 'Marin County Nature Escape',
        date: '2025-09-02',
        location: 'Sausalito, CA',
        refLat: 37.8590,
        refLng: -122.4852,
        tripRadius: 20.00,
        startTime: '08:00:00',
        endTime: '18:00:00',
        groupSize: 2,
        primaryTransportation: 'mixed',
        budget: 300.00,
        tripPace: 'balanced',
        tripType: 'nature',
        notes: 'Hiking and exploring beautiful Marin County',
        status: 'pending'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Trips';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: [
          'San Francisco Day Adventure',
          'Oakland Food Tour',
          'Golden Gate Park Family Day',
          'Berkeley Shopping Spree',
          'Marin County Nature Escape'
        ]
      }
    }, {});
  }
};
