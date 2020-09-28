const { Meeting, ProfessorStudent } = require('../models');

const controller = {
  getMeetings: async (req, res) => {
    try {
      const { id } = req.query;

      if (req.user.type === 'professor') {
        const profStud = await ProfessorStudent.findOne({
          where: { studentId: parseInt(id) },
        });
        if (profStud) {
          const meetings = await Meeting.findAll({
            where: { professorStudentId: profStud.id },
          });
          res.status(200).send(meetings);
        } else {
          res.status(400).send({ message: 'Nu relatie' });
        }
      } else {
        const profStud = await ProfessorStudent.findOne({
          where: { userId: parseInt(id) },
        });
        if (profStud) {
          const meetings = await Meeting.findAll({
            where: { professorStudentId: profStud.id },
          });
          res.status(200).send(meetings);
        } else {
          res.status(400).send({ message: 'Nu relatie' });
        }
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  createMeeting: async (req, res) => {
    try {
      const { date, time, location, studentId } = req.body;

      const profStud = await ProfessorStudent.findOne({
        where: { studentId, userId: req.user.id },
      });

      if (profStud) {
        await Meeting.create({
          location,
          date,
          time,

          professorStudentId: profStud.id,
        });
        res.status(201).send({ message: 'Intalnire adaugata' });
      } else {
        res.status(400).send({ message: 'No student-professor relationship' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
  updateMeeting: async (req, res) => {
    try {
      const { id, location, date, time } = req.body;

      const meeting = await Meeting.findOne({ where: { id: id } });

      if (!meeting) {
        res.status(400).send({ message: 'Intalnirea nu exista!' });
      } else {
        await meeting.update({ ...meeting, location, date, time });
        console.log(meeting);

        res.status(200).send({ message: 'Intalnire editata cu succes!' });
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  deleteMeeting: async (req, res) => {
    try {
      const { id } = req.body;

      const errors = [];
      const meeting = await Meeting.findOne({ where: { id } });

      if (!meeting) {
        errors.push("Meeting doesn't exist");
      }

      if (errors.length === 0) {
        await meeting.destroy();

        res.status(200).send({
          message: `Intalnirea a fost stearsa cu succes!`,
        });
      } else {
        res.status(400).send({ errors });
      }
      //
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: 'Error :(',
      });
    }
  },
};
module.exports = controller;
