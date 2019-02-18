const database = require(`${__dirname}/../../database`);

function getUsersData(token, cb) {
  token = token ? token : null;
  database.execute('get-users-data-by-token', {token}, null, (err, data) => {
    if (err) return cb(err);
    return cb(null, data ? data[0] : null);
  });
}

module.exports = {
  getUsersData
};
