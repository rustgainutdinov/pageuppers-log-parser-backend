const database = require(`${__dirname}/../../database`);
const passwordHash = require('password-hash');
const uuid = require('uuid/v4');

function login(req, res, next) {
  const data = JSON.parse(req.query.data);
  database.execute('auth-user', data, null, (err, usersData) => {
    if (err) return next(err);
    if (!(usersData && usersData[0])) return next(new Error('email is invalid'));
    if (!passwordHash.verify(data.pass, usersData[0].pass)) return next(new Error('password is invalid'));

    const token = usersData[0]['auth_token'];
    const newToken = uuid();

    database.execute('update-user-token', {token, newToken}, null, (err, _) => {
      if (err) return next(err);

      return res.status(200).json({
        token: newToken,
        'access-right': usersData[0]['access_right']
      }).end();
    });
  });
}

module.exports = login;
