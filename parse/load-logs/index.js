const fs = require('fs');
const http = require('http');
const database = require(`${__dirname}/../../database`);
const uuid = require('uuid/v4');
let path;

function getDomainId(domain, cb) {
	database.execute('get-domain-count', {domain}, null, (err, result) => {
		if (err) return cb(err);
		let domainsId;
		if (result.length === 0) {
			const id = uuid();
			domainsId = id;
			database.execute('insert-domain', {domainsId: id, domain}, null, err => {
				if (err) return cb(err);
				database.execute('set-status', {domainsId: id, statusTypeId: 'ea38a26b477b4db29906abc0a18f32ea'}, null, err => {
				});
				cb(null, domainsId, domain);
			});
		} else {
			domainsId = result[0]['domains_id'];
			cb(null, domainsId, domain);
		}
	});
}


function parseLogs(wptPath, date, cb) {
	path = __dirname + '/../../lists/' + wptPath + '.log';
	var file = fs.createWriteStream(path);
	http.get('http://webpagetest.org/logs/' + wptPath + '.log', function (response) {
		response.pipe(file);
		file.on('finish', function () {
			fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
				if (err) return console.log(err);
				let total = 0;
				let uniq = 0;
				let api = 0;
				let sortedByDomain = {};
				data
				.split(/\n/gi)
				.map(item => {
					const reg = item.match(/(\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2})\b.([\d\w.:]+)\b.+?(\d{6}.{36})\b.+?(.+?)\t(.+?)- <b>(.+?)<\/b>.+?([\d\w]{32,40}).+?([\d\w.]{0,34})?/i);
					return reg ? reg : null;
				})
				.forEach(item => {
					if (!item) return;
					let domain = (item[4] + ' ').match(/\/\/(www\.)?((.+?)(\..+?)+)[\/\b\s]+/i);
					if (!domain) return;
					domain = domain[2].replace(/www\./i, '');
					if (!sortedByDomain[domain]) sortedByDomain[domain] = {};
					const counter = sortedByDomain[domain][item[4]] ? sortedByDomain[domain][item[4]].counter + 1 : 1;
					const urlData = {
						url: item[4],
						counter,
						ip: item[2],
						location: item[5],
						browser: item[6],
						wptId: item[3],
						dateTime: item[1],
						api: item[8] ? true : false
					};
					item[8] ? api++ : api;
					counter === 1 ? uniq++ : counter === 2 ? uniq-- : counter;
					total++;
					sortedByDomain[domain][item[4]] = urlData;
				});
				let domain;
				for (domain in sortedByDomain) {
					getDomainId(domain, (err, domainsId, domain) => {
						if (err) return;
						let url;
						for (url in sortedByDomain[domain]) {
							total = total + sortedByDomain[domain][url].counter;
							sortedByDomain[domain][url].domainsId = domainsId;
							database.execute('insert-url', sortedByDomain[domain][url], null, err => {
								if (err) return;
							});
						}
					});
				}
				database.execute('insert-log', {date, total, api, uniq}, null, err => {
					if (err) console.log(err)
				});
			});
		});
	});
}

module.exports = parseLogs;
