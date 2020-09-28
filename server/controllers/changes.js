const { ChangeOnRequestPaper, ProfessorStudent } = require('../models');
const controller = {
  getChanges: async (req, res) => {
    try {
      const { id } = req.query;

      if (req.user.type === 'professor') {
        const profStud = await ProfessorStudent.findOne({
          where: { studentId: parseInt(id) },
        });
        if (profStud) {
          const changes = await ChangeOnRequestPaper.findAll({
            where: { professorStudentId: profStud.id },
          });
          res.status(200).send(changes);
        } else {
          res.status(400).send({ message: 'Nu exista relatie!' });
        }
      } else {
        const profStud = await ProfessorStudent.findOne({
          where: { userId: parseInt(id) },
        });
        if (profStud) {
          const changes = await ChangeOnRequestPaper.findAll({
            where: { professorStudentId: profStud.id },
          });
          res.status(200).send(changes);
        } else {
          res.status(400).send({ message: 'Nu exista relatie' });
        }
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  createChange: async (req, res) => {
    try {
      const { title, body, modifyDate, studentId } = req.body;

      const profStud = await ProfessorStudent.findOne({
        where: { studentId, userId: req.user.id },
      });

      if (profStud) {
        await ChangeOnRequestPaper.create({
          title,
          body,
          modifyDate,

          professorStudentId: profStud.id,
        });
        res.status(201).send({ message: 'Modificarea a fost inregistrata! ' });
      } else {
        res.status(400).send({ message: 'Nu exista relatie!' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;
