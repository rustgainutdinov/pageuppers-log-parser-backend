const database = require(`${__dirname}/../../database`);
const User = require(`${__dirname}/../../models/user`);
const parse = require(`${__dirname}/../../parse/log`);

function getDateAgo(date, days) {
  date.setDate(date.getDate() + days);
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return yyyy + '-' + mm + '-' + dd;
}

function execute(req, res, next) {
  const token = req.query.token;
  const data = JSON.parse(req.query.data);
  const date = new Date(data.date);

  User.getUsersData(token, (err, usersData) => {
    if (err) return next(err);
    const accessRight = usersData ? usersData['access_right'] : null;

    const startEndDate = {
      startDate: getDateAgo(date, 0),
      endDate: getDateAgo(date, 1)
    };

    database.execute('count-logs', startEndDate, accessRight, (err, result) => {
      if (err) return next(err);

      if (Number(result[0].count) === 0) {
        parse(data.date.replace(/-/ig, ''), (err) => {
          if (err) return next(err);
        });
        return res.status(200).json({message: 'wait'});
      }

      database.execute('get-urls-by-date', startEndDate, accessRight, (err, result) => {
        if (err) return next(err);
        res.status(200).json(result);
      });
    });
  });
}

module.exports = execute;
