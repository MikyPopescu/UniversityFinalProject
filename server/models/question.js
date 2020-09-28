module.exports = function (sequelize, DataTypes) {
  return sequelize.define('question', {
    question: DataTypes.STRING,
  });
};
