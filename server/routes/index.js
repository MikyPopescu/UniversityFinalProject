const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../controllers').auth.middleware;
// import Routes
const reset = require('./reset');
const users = require('./users');
const auth = require('./auth');
const profStuds = require('./profStuds');
const profStudData = require('./profStudData');
const qa = require('./qa');

//Route middleware
router.use('/reset', reset);
router.use('/auth', auth);
router.use('/users', isAuthenticated, users);
router.use('/profStuds', isAuthenticated, profStuds);
router.use('/profStudData', isAuthenticated, profStudData);
router.use('/qa', isAuthenticated, qa);

module.exports = router;
