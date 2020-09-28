module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    type: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  });
};
