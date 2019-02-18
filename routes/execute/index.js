const database = require(`${__dirname}/../../database`);
const User = require(`${__dirname}/../../models/user`);

function execute(req, res, next) {
  const data = req.query.data ? JSON.parse(req.query.data) : null;
  const token = req.query.token ? req.query.token : null;
  const query = req.params.query;

  User.getUsersData(token, (err, usersData) => {
    if (err) return next(err);
    const accessRight = usersData ? usersData['access_right'] : null;

    database.execute(query, data, accessRight, (err, result) => {
      if (err) return next(err);
      res.status(200).json(result);
    });
  });
}

module.exports = execute;
