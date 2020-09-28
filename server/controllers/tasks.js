const { Task, ProfessorStudent } = require('../models');

const controller = {
  getTasks: async (req, res) => {
    try {
      const { id } = req.query;

      if (req.user.type === 'professor') {
        const profStud = await ProfessorStudent.findOne({
          where: { studentId: parseInt(id) },
        });
        if (profStud) {
          const tasks = await Task.findAll({
            where: { professorStudentId: profStud.id },
          });
          res.status(200).send(tasks);
        } else {
          res.status(400).send({ message: 'Nu exista relatie!' });
        }
      } else {
        const profStud = await ProfessorStudent.findOne({
          where: { userId: parseInt(id) },
        });
        if (profStud) {
          const tasks = await Task.findAll({
            where: { professorStudentId: profStud.id },
          });
          res.status(200).send(tasks);
        } else {
          res.status(400).send({ message: 'Nu exista relatie' });
        }
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  createTask: async (req, res) => {
    try {
      const { name, dueDate, dueTime, studentId } = req.body;

      const profStud = await ProfessorStudent.findOne({
        where: { studentId, userId: req.user.id },
      });

      if (profStud) {
        await Task.create({
          name,
          dueDate,
          dueTime,
          professorStudentId: profStud.id,
        });
        res.status(201).send({ message: 'Activitatea a fost adaugata! ' });
      } else {
        res.status(400).send({ message: 'Nu exista relatie!' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
  updateTask: async (req, res) => {
    try {
      const { id, name, dueDate, dueTime } = req.body;

      const task = await Task.findOne({ where: { id: id } });

      if (!task) {
        res.status(400).send({ message: 'Activitatea nu exista!' });
      } else {
        await task.update({ ...task, name, dueDate, dueTime });
        //console.log(task);

        res.status(200).send({ message: 'Activitate editata cu succes!' });
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  deleteTask: async (req, res) => {
    try {
      const { id } = req.body;

      const errors = [];
      const task = await Task.findOne({ where: { id } });

      if (!task) {
        errors.push("Task doesn't exist");
      }

      if (errors.length === 0) {
        await task.destroy();

        res.status(200).send({
          message: `Activitatea a fost stearsa cu succes!`,
        });
      } else {
        res.status(400).send({ errors });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: 'Eroare de server :(',
      });
    }
  },
};

module.exports = controller;
