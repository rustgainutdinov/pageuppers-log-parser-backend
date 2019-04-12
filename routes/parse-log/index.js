const database = require(`${__dirname}/../../database`);
const User = require(`${__dirname}/../../models/user`);
const parse = require(`${__dirname}/../../parse/load-logs`);

function execute(req, res, next) {
	const token = req.query.token;
	const data = JSON.parse(req.query.data);
	if (!data.date) return next(new Error('error date type'));
	const date = data.date;
	User.getUsersData(token, (err, usersData) => {
		if (err) return next(err);
		const accessRight = usersData ? usersData['access_right'] : null;
		database.execute('get-log-load-data', {date}, accessRight, (err, result) => {
			if (err) return next(err);
			if (result.length === 0) {

				const wptPath = date.replace(/-/ig, '');
				parse(wptPath, date, (err) => {
					if (err) return next(err);
				});
				return res.status(200).json({message: 'wait'});
			}
		});
	});
}

module.exports = execute;
