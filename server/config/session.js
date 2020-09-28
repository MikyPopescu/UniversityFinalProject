const cookieSession = require('cookie-session');

module.exports = cookieSession({
  name: 'session',
  keys: ['asaiudsa8uasy323@asdasx!@#!@#$@!a'],
  maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  httpOnly: true,
});
