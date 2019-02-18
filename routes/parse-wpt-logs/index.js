const parse = require(`${__dirname}/../../parse/log`);
const User = require(`${__dirname}/../../models/user`);

function parseLogs(req, res, next) {
  const date = req.params.date.toString();
  const token = req.query.token.toString();

  User.getUsersData(token, (err, usersData) => {
    if (err) return next(err);
    const accessRight = usersData ? usersData['access_right'] : null;
    if (Number(accessRight) < 500) return next(new Error('you have no rights'));
    parse(date, (err) => {
      if (err) return next(err);
      res.status(200).json({message: 'success'});
    });
  });
}

module.exports = parseLogs;
