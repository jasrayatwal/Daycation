'use strict';

const { Activity } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Activities';
    await Activity.bulkCreate([
      {
        tripId: 1,
        orderNumber: 1,
        type: 'cultural',
        title: 'Golden Gate Bridge',
        address: 'Golden Gate Bridge, San Francisco, CA',
        lat: 37.8199,
        lng: -122.4783,
        startTime: '09:00:00',
        endTime: '10:30:00',
        durationMin: 90,
        transportType: 'transit',
        costEstimate: 15.00,
        notes: 'Take photos and enjoy the view'
      },
      {
        tripId: 1,
        orderNumber: 2,
        type: 'meal',
        title: 'Fisherman\'s Wharf Lunch',
        address: 'Pier 39, San Francisco, CA',
        lat: 37.8087,
        lng: -122.4098,
        startTime: '12:00:00',
        endTime: '13:30:00',
        durationMin: 90,
        transportType: 'walk',
        costEstimate: 35.00,
        notes: 'Try the clam chowder'
      },
      {
        tripId: 1,
        orderNumber: 3,
        type: 'cultural',
        title: 'Alcatraz Island Tour',
        address: 'Alcatraz Island, San Francisco, CA',
        lat: 37.8267,
        lng: -122.4233,
        startTime: '14:30:00',
        endTime: '17:00:00',
        durationMin: 150,
        transportType: 'transit',
        costEstimate: 45.00,
        notes: 'Audio tour included'
      },

      {
        tripId: 2,
        orderNumber: 1,
        type: 'meal',
        title: 'Oakland Gourmet Ghetto',
        address: 'Shattuck Avenue, Berkeley, CA',
        lat: 37.8715,
        lng: -122.2730,
        startTime: '11:00:00',
        endTime: '12:30:00',
        durationMin: 90,
        transportType: 'walk',
        costEstimate: 25.00,
        notes: 'Multiple food vendors'
      },
      {
        tripId: 2,
        orderNumber: 2,
        type: 'meal',
        title: 'Swan\'s Market',
        address: '907 Washington St, Oakland, CA',
        lat: 37.7956,
        lng: -122.2675,
        startTime: '13:00:00',
        endTime: '14:30:00',
        durationMin: 90,
        transportType: 'walk',
        costEstimate: 30.00,
        notes: 'Local artisan foods'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Activities';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      tripId: {
        [Op.in]: [1, 2]
      }
    }, {});
  }
};
