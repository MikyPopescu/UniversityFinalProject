const express = require('express');
const router = express.Router();

const { qa } = require('../controllers');

router.get('/questions', qa.getQuestions);
router.post('/questions', qa.addQuestion);
router.post('/answer', qa.answerAQuestion);

module.exports = router;
