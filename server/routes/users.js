const express = require('express');
const router = express.Router();
const { User } = require('../models');

const { users } = require('../controllers');

router.get('/', users.getUsers);

router.get('/info', users.getUserInfo);

router.get('/professorList', users.professorList);

module.exports = router;
