const userQueries = require('./user');
const urlQueries = require('./url');
const domainQueries = require('./domain');
const logQueries = require('./log');

const queries = Object.assign(userQueries, urlQueries, domainQueries, logQueries);

module.exports = queries;
