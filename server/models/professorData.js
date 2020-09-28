module.exports = function (sequelize, DataTypes) {
  return sequelize.define('professorData', {
    academicTitle: DataTypes.STRING,
    maxStudents: DataTypes.INTEGER,
  });
};
