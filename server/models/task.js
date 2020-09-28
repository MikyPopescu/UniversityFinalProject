module.exports = function (sequelize, DataTypes) {
  return sequelize.define('task', {
    name: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    dueTime: DataTypes.STRING,
  });
};
