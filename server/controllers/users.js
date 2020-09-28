const { User, StudentData, ProfessorData } = require('../models');

const controller = {
  getUsers: async (req, res) => {
    // res.send("We are on users!");
    try {
      const users = await User.findAll();
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const { id, firstName, lastName, email, type } = req.user;
      let userData;
      if (type === 'student') {
        userData = await StudentData.findOne({
          where: {
            userId: id,
          },
        });
      }
      if (type === 'professor') {
        userData = await ProfessorData.findOne({
          where: {
            userId: id,
          },
        });
      }
      res.status(200).send({
        id,
        firstName,
        lastName,
        email,
        type,
        specialization: userData.specialization,
        faculty: userData.faculty,
        promotion: userData.promotion,
        academicTitle: userData.academicTitle,
        maxStudents: userData.maxStudents,
      });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },

  //Api get lista de profesori
  professorList: async (req, res) => {
    try {
      let professors = await User.findAll({
        where: {
          type: 'professor',
        },
      });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;
