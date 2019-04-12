const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const login = require('./routes/login');
const auth = require('./routes/auth');
const register = require('./routes/register');
const execute = require('./routes/execute');
const parse = require('./routes/parse');
const loadLogs = require('./routes/load-logs');
const parseLog = require('./routes/parse-log');
const routes = require('./routes');
const validate = require('./middleware/validate');

const app = express();

//configuration
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

//routing
app.get(
	'/login',
	(req, _, next) => validate.checkRequired(req, 'query[data]', next),
	login);

app.get(
	'/auth',
	(req, _, next) => validate.checkRequired(req, 'query[token]', next),
	auth);

app.get(
	'/register',
	(req, _, next) => validate.checkRequired(req, 'query[data]', next),
	(req, _, next) => validate.checkRequired(req, 'query[token]', next),
	register);

app.get(
	'/execute/:query',
	(req, _, next) => validate.checkRequired(req, 'params[query]', next),
	execute);

app.get(
	'/parse',
	(req, _, next) => validate.checkRequired(req, 'query[data]', next),
	(req, _, next) => validate.checkRequired(req, 'query[token]', next),
	parse);

app.get(
	'/load-logs',
	(req, _, next) => validate.checkRequired(req, 'query[data]', next),
	(req, _, next) => validate.checkRequired(req, 'query[token]', next),
	loadLogs);

app.get(
	'/parse-log',
	(req, _, next) => validate.checkRequired(req, 'query[data]', next),
	(req, _, next) => validate.checkRequired(req, 'query[token]', next),
	parseLog);


app.use(routes.notFound);
app.use((err, req, res, next) => {
	if (app.get('env') === 'development') console.log(err);
	routes.error(err, req, res, next);
});

//listening
const port = process.env.PORT || 3080;
app.listen(port, () => {
	console.log(`App started on localhost:${port}`);
});
