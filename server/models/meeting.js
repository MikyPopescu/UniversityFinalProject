module.exports = function (sequelize, DataTypes) {
  return sequelize.define('meeting', {
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    location: DataTypes.STRING,
  });
};
