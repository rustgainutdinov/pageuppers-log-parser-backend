const parse = require(`${__dirname}/../../parse/url-xml`);
const database = require(`${__dirname}/../../database`);
const User = require(`${__dirname}/../../models/user`);

function parseUrl(req, res, next) {
  const data = JSON.parse(req.query.data);
  const token = req.query.token.toString();

  User.getUsersData(token, (err, usersData) => {
    if (err) return next(err);
    const accessRight = usersData ? usersData['access_right'] : null;
    if (Number(accessRight) < 500) return next(new Error('you have no rights'));
    if (!data.wptId) return next(new Error('WPT Id is not defined'));
    parse(data.wptId, (err, result) => {
      if (err) return next(err);
      result.wptId = data.wptId;
      database.execute('update-url', result, accessRight, (err, updateResult) => {
        if (err) return next(err);
        res.status(200).json(result);
      });
    });
  });
}

module.exports = parseUrl;
