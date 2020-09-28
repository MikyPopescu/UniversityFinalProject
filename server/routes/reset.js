const express = require('express');
const router = express.Router();

const { reset } = require('../controllers');

router.get('/', reset.reset);

module.exports = router;
