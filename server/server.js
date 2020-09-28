const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const passport = require('passport');

const { session } = require('./config');

const app = express();
const { sequelize } = require('./models');

sequelize.sync();

const configure = (app) => {
  app.use(bodyParser.json());
  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', router);
};

module.exports = configure;

configure(app);

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`I am running on port ${port}: http://localhost:8080`)
);
