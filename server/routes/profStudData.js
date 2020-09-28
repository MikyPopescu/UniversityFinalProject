const express = require('express');
const router = express.Router();

const { profStudsData } = require('../controllers');

router.get('/prof', profStudsData.getProfessorData);
router.get('/stud', profStudsData.getStudentData);
module.exports = router;
