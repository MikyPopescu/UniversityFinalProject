const { Message, ProfessorStudent } = require('../models');
const { Op } = require('sequelize');

const controller = {
  getMessages: async (req, res) => {
    try {
      const { id } = req.query;
      const profStud = await ProfessorStudent.findOne({
        where: {
          studentId: {
            [Op.or]: [req.user.id, id],
          },
          userId: {
            [Op.or]: [req.user.id, id],
          },
        },
      });

      if (profStud) {
        const messages = await Message.findAll({
          where: { professorStudentId: profStud.id },
        });
        res.status(200).send(messages);
      } else {
        res.status(400).send({ message: 'Nu exista relatie' });
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { id } = req.query;
      const { content } = req.body;
      console.log(req.user.id, id);
      const profStud = await ProfessorStudent.findOne({
        where: {
          studentId: {
            [Op.or]: [req.user.id, id],
          },
          userId: {
            [Op.or]: [req.user.id, id],
          },
        },
      });

      if (profStud) {
        const msg = await Message.create({
          content,
          sender: req.user.id,
          receiver: id,
          professorStudentId: profStud.id,
        });
        res.status(201).send(msg);
      } else {
        res.status(400).send({ message: 'Nicio relatie' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;
