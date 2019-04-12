const logQueries = {
	'count-logs': {
		sql:
			`SELECT 
      COUNT(urls_id)
      FROM urls
      WHERE date_time >= ?(startDate) AND date_time < ?(endDate)`,
		accessRight: 500
	},
	'load-all-logs-count': {
		sql:
			`SELECT 
      DATE(date_time), COUNT(urls_id) 
      FROM urls 
      GROUP BY DATE(date_time);`,
		accessRight: 500
	},
	'insert-log': {
		sql:
			`INSERT
			INTO load_log
			(load_log_id, date, api_tests, uniq_tests, total_tests, all_tests)
			VALUES
			(?(logId), ?(date), ?(api), ?(uniq), ?(total), ?(all))`
	},
	'get-log-load-data': {
		sql:
			`SELECT 
			load_log_id 
			FROM load_log
			WHERE date = ?(date) AND total_tests IS NOT NULL`
	},
	'get-log-info': {
		sql:
			`SELECT *
			FROM 
			load_log
			WHERE date =?(date)`
	},
	'get-logs-load-date-info': {
		sql:
			`SELECT * FROM load_log ORDER BY load_date DESC`
	}
};

module.exports = logQueries;
