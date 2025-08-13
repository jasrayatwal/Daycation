const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const tripsRouter = require('./trips.js');
const mapsRouter = require('./maps');
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/trips', tripsRouter);
router.use('/maps', mapsRouter);

module.exports = router;
