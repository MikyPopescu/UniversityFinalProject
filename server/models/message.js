module.exports = function (sequelize, DataTypes) {
  return sequelize.define('message', {
    content: DataTypes.STRING,
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
  });
};
