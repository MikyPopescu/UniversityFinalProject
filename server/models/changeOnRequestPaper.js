module.exports = function (sequelize, DataTypes) {
  return sequelize.define('changeOnRequestPaper', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    modifyDate: DataTypes.STRING,
  });
};
