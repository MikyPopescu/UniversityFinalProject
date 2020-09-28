const bcrypt = require('bcryptjs'); //pt criptare parola
const passport = require('passport'); //middleware pt autenitifcare
const saltRounds = 10; ///timp necesar pentru a calcula un bcrypt hash
const { Op } = require('sequelize');
const { User, ProfessorData, StudentData } = require('../models');

const LocalStrategy = require('passport-local').Strategy;

//using passport with localStrategy for login
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      const user = await User.findOne({ where: { email }, raw: true });
      if (user) {
        bcrypt.compare(password, user.password, async (err, result) => {
          if (result) {
            return done(null, user); //login cu succes
          } else {
            return done(null, false, { message: 'Incorrect password' });
          }
        });
      } else {
        return done(null, false, { message: 'Incorrect email' });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id }, raw: true });

  done(null, user);
});

//check succesful auth
const middleware = {
  isAuthenticated: async (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(403).send({ message: 'Unauthorized' });
    } else {
      return next();
    }
  },
  authenticate: passport.authenticate('local'),
};

//register
const controller = {
  register: async (req, res) => {
    const {
      email,
      firstName,
      lastName,
      password,
      type,
      academicTitle,
      specialization,
      promotion,
    } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user)
      res.status(401).send({
        message: `Email ${user.email} is already registered.`,
      });
    else
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          try {
            const errors = [];
            if (!firstName) {
              errors.push('Incorect first name');
            }

            if (errors.length > 0) {
              res.status(400).send({
                errors,
              });
            } else {
              const user = await User.create({
                firstName,
                lastName,
                type,
                email,
                token: Math.random().toString(36),
                password: hash,
              });

              if (type === 'professor') {
                await ProfessorData.create({
                  userId: user.id,
                  maxStudents: 15,
                  academicTitle,
                });
              } else {
                await StudentData.create({
                  userId: user.id,
                  specialization,
                  promotion,
                  faculty: 'CSIE',
                });
              }
              res.status(200).send({
                message: `User ${user.firstName} ${user.lastName} was created`,
              });
            }
          } catch (e) {
            console.error(e);
            res.status(500).send({ message: 'Server error :(' });
          }
        });
      });
  },

  logout: (req, res) => {
    req.logout();
    res.status(200).send({ message: "You've been logged out" });
  },

  editUser: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        changePassword,
        specialization,
        promotion,
        academicTitle,
      } = req.body;

      const errors = [];
      const user = await User.findOne({ where: { id: req.user.id } });

      let userData;
      if (user.type === 'student') {
        userData = await StudentData.findOne({
          where: { userId: req.user.id },
        });
      }
      if (user.type === 'professor') {
        userData = await ProfessorData.findOne({
          where: { userId: req.user.id },
        });
      }

      if (!user) {
        errors.push('user not exists');
      }

      if (!firstName) {
        errors.push('First name is empty');
      }
      if (!lastName) {
        errors.push('Last name is empty');
      }
      if (!email) {
        errors.push('Email is empty');
      } else if (
        !email.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        )
      ) {
        errors.push('Email invalid');
      } else if (
        await User.findOne({
          where: { email, id: { [Op.ne]: req.session.id } },
          raw: true,
        })
      ) {
        errors.push('Email already used');
      }
      if (changePassword && !password) {
        errors.push('Password is empty');
      }
      let userInfo;

      if (errors.length === 0) {
        const u = await user.update({
          ...user,
          firstName,
          lastName,
          email,
          password: changePassword ? password : user.password,
        });
        if (user.type === 'student') {
          userInfo = await userData.update({
            ...userData,
            specialization: specialization
              ? specialization
              : userData.specialization,
            promotion: promotion ? promotion : userData.promotion,
          });
        }

        if (user.type === 'professor') {
          userInfo = await userData.update({
            ...userData,
            academicTitle: academicTitle
              ? academicTitle
              : userData.academicTitle,
          });
        }

        res.status(201).send({
          message: `Utilizatorul ${firstName} ${lastName} a fost modificat`,
          user: {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            type: u.type,
            specialization: userInfo.specialization,
            faculty: userInfo.faculty,
            promotion: userInfo.promotion,
            academicTitle: userInfo.academicTitle,
            maxStudents: userInfo.maxStudents,
            currentStudents: userInfo.currentStudents,
          },
        });
      } else {
        res.status(400).send({ errors });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: 'Error',
      });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const errors = [];
      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        errors.push('user not exists');
      }

      if (errors.length === 0) {
        const { firstName, lastName } = user;
        await user.destroy();

        req.logout();
        res.status(201).send({
          message: `Utilizatorul ${firstName} ${lastName} a fost șters cu succes`,
        });
      } else {
        res.status(400).send({ errors });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: 'Eroare :(',
      });
    }
  },

  middleware,
};

module.exports = controller;
