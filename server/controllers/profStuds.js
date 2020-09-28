const { ProfessorStudent, User } = require('../models');

const controller = {
  //studentii care au trimis cerere unui prof
  getPendingStudents: async (req, res) => {
    try {
      const profStudents = await ProfessorStudent.findAll({
        where: {
          userId: req.user.id,
          state: 'pending',
        },
      });
      const students = await Promise.all(
        profStudents.map(async (profStud) => {
          const student = await User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'email'],
            where: { id: profStud.studentId },
            raw: true,
          });
          return {
            student,
            state: profStud.state,

            id: profStud.id,
          };
        })
      );
      res.status(200).send(students);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  //studentii care sunt asignati
  getAssignedStudents: async (req, res) => {
    try {
      console.log(req.user.id);
      const profStudents = await ProfessorStudent.findAll({
        where: {
          userId: req.user.id,
          state: 'approved', //?
        },
      });
      const students = await Promise.all(
        profStudents.map(async (profStud) => {
          const student = await User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'email'],
            where: { id: profStud.studentId },
            raw: true,
          });
          return {
            student,
            state: profStud.state,

            id: profStud.id,
          };
        })
      );
      res.status(200).send(students);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getProfessors: async (req, res) => {
    try {
      const professors = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'type'],
        where: {
          type: 'professor',
        },
        raw: true,
      });
      res.status(200).send(professors);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getProfessor: async (req, res) => {
    try {
      const { id } = req.user;
      console.log(id);

      const profStud = await ProfessorStudent.findOne({
        where: { studentId: id },
      });

      if (profStud && profStud.state === 'approved') {
        const profData = await User.findOne({
          where: { id: profStud.userId },
        });
        res.status(200).send(profData);
      } else {
        res.status(404).send({ message: 'Nu relatie' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Eroare de server :(' });
    }
  },
  getStudents: async (req, res) => {
    try {
      const students = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'type'],
        where: {
          type: 'student',
        },
        raw: true,
      });
      res.status(200).send(students);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  approveStudent: async (req, res) => {
    try {
      const { id } = req.body;
      const profStud = await ProfessorStudent.findOne({
        where: { studentId: id, userId: req.user.id },
      });
      if (!profStud) {
        res.status(400).send({ message: 'Studentul nu are cerere facuta' });
      } else if (profStud.state === 'approved') {
        res
          .status(400)
          .send({ message: 'Studentul este deja asignat dumneavoastra' });
      } else {
        await profStud.update({ ...profStud, state: 'approved' });
        res.status(200).send({ message: 'Student asignat cu succes' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Eroare de server :(' });
    }
  },
  rejectStudent: async (req, res) => {
    try {
      const { id } = req.body;

      const profStud = await ProfessorStudent.findOne({
        where: { studentId: id, userId: req.user.id },
      });
      if (profStud) {
        await profStud.destroy();
        res.status(200).send({
          message: `Studentul a fost sters `,
        });
      } else {
        res.status(400).send({ message: 'Studentul nu a fost gasit' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Eroare de server :(' });
    }
  },

  addEntity: async (req, res) => {
    //
    //if(currentStudents<maxStudents....)
    //currentStudents--
    try {
      const { id } = req.body;
      const professor = await User.findOne({
        where: { id, type: 'professor' },
        raw: true,
      });
      // console.log(id, req.user.id);
      if (req.user.type !== 'student') {
        res.status(400).send({ message: 'Nu esti student, sorry.' });
      } else if (!professor) {
        res.status(400).send({ message: 'Nu s-a gasit profesor' });
      } else {
        const profStud = await ProfessorStudent.findOne({
          where: {
            studentId: req.user.id,
            userId: id,
          },
        });
        if (!profStud) {
          await ProfessorStudent.create({
            state: 'pending',
            studentId: req.user.id,
            userId: id,
          });
          res.status(201).send({ message: 'Solicitarea de coordonare a fost trimisa' });
        } else {
          res.status(400).send({ message: 'Ati mai trimis o solicitare!' });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Eroare de server :(' });
    }
  },

  editEntity: async (req, res) => {
    try {
      //?
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Eroare de server :(' });
    }
  },
};

module.exports = controller;
