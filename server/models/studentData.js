module.exports = function (sequelize, DataTypes) {
  return sequelize.define('studentData', {
    specialization: DataTypes.STRING,
    promotion: DataTypes.STRING,
    faculty: DataTypes.STRING,
  });
};
