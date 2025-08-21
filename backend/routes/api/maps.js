const express = require('express');
const router = express.Router();
const { googleMapsAPIKey, dashboardMapId, landingMapId } = require('../../config');

router.post('/key', (req, res) => {
  res.json({ googleMapsAPIKey, dashboardMapId, landingMapId });
});

module.exports = router;
