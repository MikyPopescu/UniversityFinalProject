module.exports = function (sequelize, DataTypes) {
  return sequelize.define('professorStudent', {
    state: DataTypes.STRING,
    studentId: DataTypes.INTEGER,
  });
};
