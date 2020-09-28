const Sequelize = require('sequelize');

const { db } = require('../configuration');

const sequelize = new Sequelize(db.database, db.userName, db.password, {
  dialect: db.dialect,
});

module.exports = sequelize;
