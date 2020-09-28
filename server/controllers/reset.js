const { sequelize } = require('../models');
module.exports = {
  reset: async (req, res) => {
    try {
      await sequelize.sync({ force: true });
      res.status(200).send({
        message: 'DB reseted',
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: 'Server error :(',
      });
    }
  },
};
