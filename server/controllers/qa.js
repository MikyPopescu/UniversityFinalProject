const { Question, Answer } = require('../models');

const controller = {
  getQuestions: async (req, res) => {
    try {
      const questions = await Question.findAll();

      res.status(200).send(questions);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  addQuestion: async (req, res) => {
    try {
      const { question } = req.body;
      await Question.create({
        question,
      });
      res.status(201).send({ message: 'Question added' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  answerAQuestion: async (req, res) => {
    try {
      //imi trebuie FK de la Question?
      const { answer, rate } = req.body;
      await Answer.create({ answer, rate });

      res.status(201).send({ message: 'Answer added' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;
