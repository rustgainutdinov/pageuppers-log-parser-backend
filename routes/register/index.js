const database = require(`${__dirname}/../../database`);
const passwordHash = require('password-hash');
const User = require(`${__dirname}/../../models/user`);
const uuid = require('uuid/v4');

function register(req, res, next) {
  const data = JSON.parse(req.query.data);
  const token = req.query.token;

  User.getUsersData(token, (err, usersData) => {
    if (err) return next(err);
    if (!data) return next(err);

    const accessRight = usersData ? usersData['access_right'] : null;

    data.pass = passwordHash.generate(data.pass);
    data.authToken = uuid();

    database.execute('create-user', data, accessRight, (err, result) => {
      if (err) return next(err);
      res.status(200).json({token: data.authToken});
    });
  });
}

module.exports = register;
