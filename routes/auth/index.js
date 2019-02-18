const User = require(`${__dirname}/../../models/user`);

function execute(req, res, next) {
  const token = req.query.token;

  User.getUsersData(token, (err, usersData) => {
    if (err) return next(err);
    res.status(200).json(usersData);
  });
}

module.exports = execute;
