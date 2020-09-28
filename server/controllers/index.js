//Calling the functions (controllers)

const reset = require('./reset.js');

const users = require('./users');

const auth = require('./auth');

const profStuds = require('./profStuds');

const profStudsData = require('./profStudData');

const qa = require('./qa');

const changes = require('./changes');

const tasks = require('./tasks');

const messages = require('./messages');

const meetings = require('./meetings');

module.exports = {
  reset,
  users,
  auth,
  profStuds,
  profStudsData,
  qa,
  tasks,
  messages,
  changes,
  meetings,
};
