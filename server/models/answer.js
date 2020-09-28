module.exports = function (sequelize, DataTypes) {
  return sequelize.define('answer', {
    answer: DataTypes.STRING,
  });
};
