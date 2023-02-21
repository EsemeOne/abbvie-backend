const authConfig = require('./auth-config.json');

module.exports = (role) => authConfig[role];
