'use strict';
const fs = require('fs');
const http = require('http');
const database = require(`${__dirname}/../../database`);
const uuid = require('uuid/v4');

// const now = new Date();
// const nowDate = `${now.getFullYear()}${(now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`;
let path;

function insertUrl(data, startEndDate) {
	startEndDate['url'] = data.url;
	database.execute('find-url', startEndDate, null, (err, result) => {
		if (err) return;
		if (result.length !== 0) {
			data['urlsId'] = result[0]['urls_id'];
			data['counter'] = Number(result[0]['counter']) + 1;
			console.log(data['urlsId'], data['counter']);
			database.execute('update-url-log', data, null, (err, result) => {
				if (err) return
			});
		} else {
			database.execute('insert-url', data, null, (err, result) => {
				if (err) return
			});
		}
	});
}

function workWithUrl(reg, startEndDate, cb) {
	if (!reg) return cb();
	const url = (reg[4] + ' ')
	.match(/\/\/((www\.)?(.+?)(\..+?)+)[\/\b\s]+/i);

	const urlData = {
		domainsId: null,
		url: reg[4],
		ip: reg[2],
		location: reg[5],
		browser: reg[6],
		wptId: reg[3],
		dateTime: reg[1]
	};

	if (url) {
		const domain = url[1].replace(/(www\.)/, '');
		database.execute('get-domain-count', {domain}, null, (err, result) => {
			if (err) return cb();
			if (result.length === 0) {
				const id = uuid();
				urlData.domainsId = id;
				database.execute('insert-domain', {domainsId: id, domain}, null, (err, result) => {
					if (err) return cb();
					insertUrl(urlData, startEndDate);
					cb();
				});
			} else {
				urlData.domainsId = result[0]['domains_id'];
				insertUrl(urlData, startEndDate);
				cb();
			}
		});
	} else {
		return cb();
	}
}


function parseLogs(wptPath, startEndDate, cb) {
	path = __dirname + '/../../lists/' + wptPath + '.log';
	var file = fs.createWriteStream(path);
	http.get('http://webpagetest.org/logs/' + wptPath + '.log', function (response) {
		response.pipe(file);
		file.on('finish', function () {
			fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
				if (err) return console.log(err);
				var list = data
				.split(/\n/gi)
				.map(item => {
					const reg = item
					.match(/(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2})\b.([\d\w.:]+)\b.{4,10}(\d{6}.{36})\b.(.+?)\t(.+?) - <b>(.+?)<\/b>/i);
					return reg ? reg : null;
				});
				var count = list.length;

				function reqursy() {
					count--;
					if (count === 0) {
						return;
					}
					workWithUrl(list[count], startEndDate, () => {
						reqursy();
						if (count === 1) {
							cb(null);
						}
					});
				}

				reqursy();
			});
		});
	});
}

module.exports = parseLogs;
