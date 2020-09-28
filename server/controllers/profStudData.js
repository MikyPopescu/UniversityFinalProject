const {
  ProfessorStudent,
  User,
  ProfessorData,
  StudentData,
} = require('../models');

const controller = {
  getProfessorData: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await ProfessorData.findOne({ where: { id: id } });

      if (!data) {
        res.status(400).send({ message: "Data doesn't exist" });
      } else {
        res.status(200).send(data);
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },

  getStudentData: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await StudentData.findOne({ where: { id: id } });

      if (!data) {
        res.status(400).send({ message: "Data doesn't exist" });
      } else {
        res.status(200).send(data);
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  addProfessorData: async (req, res) => {
    try {
      const { academicTitle } = req.body;

      await ProfessorData.create({ academicTitle });

      res.status(201).send({ message: 'Data added' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  addStudentData: async (req, res) => {
    try {
      const { specialization, promotion } = req.body;

      await StudentData.create({ specialization, promotion });

      res.status(201).send({ message: 'Data added' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;
