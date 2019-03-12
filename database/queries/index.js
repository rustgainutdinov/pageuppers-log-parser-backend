const queries = {
	'create-user': {
		sql:
			`INSERT INTO 
      users(name, last_name, email, pass, access_rights_id, auth_token, access_rights_id) 
      VALUES 
      (?(name), ?(lastName), ?(email), ?(pass), ?(accessRightsId), ?(authToken), '0387c26f-ec0d-40a7-a901-a0b0b8162871');`,
		accessRight: 500
	},
	'get-users-data-by-token': {
		sql:
			`SELECT 
    access_right
    FROM users
    LEFT JOIN access_rights ON users.access_rights_id = access_rights.access_rights_id
    WHERE auth_token = ?(token);`
	},
	'auth-user': {
		sql:
			`SELECT 
      auth_token, pass, access_right
      FROM users
      LEFT JOIN access_rights ON users.access_rights_id = access_rights.access_rights_id
      WHERE email = ?(email);`
	},
	'update-user-token': {
		sql:
			`UPDATE users
      SET auth_token = ?(newToken)
      WHERE auth_token = ?(token);`
	},
	'get-domain-count': {
		sql:
			`SELECT 
      domains_id
      FROM domains
      WHERE domain = ?(domain)`,
		accessRight: 500
	},
	'insert-domain': {
		sql:
			`INSERT 
      INTO domains
      (domains_id, domain) 
      VALUES
      (?(domainsId), ?(domain))`,
		accessRight: 500
	},
	'update-url-log': {
		sql:
			`UPDATE urls
			SET ip = ?(ip), location = ?(location), browser = ?(browser), wpt_id = ?(wptId), date_time = ?(dateTime), counter = ?(counter)
			WHERE urls_id = ?(urlsId);`,
	},
	'insert-url': {
		sql:
			`INSERT 
      INTO urls
      (domains_id, url, ip, location, browser, wpt_id, date_time, api, counter)
      VALUES
      (?(domainsId), ?(url), ?(ip), ?(location), ?(browser), ?(wptId), ?(dateTime), ?(api), ?(counter))`,
		accessRight: 500
	},
	'update-url': {
		sql: `UPDATE urls
      SET load_time = ?(loadTime), ttfb = ?(ttfb), bytes = ?(bytes), cdn = ?(cdn), score_cdn = ?(scoreCdn), score_keep_alive = ?(scoreKeepAlive), score_gzip = ?(scoreCompress), score_cache = ?(scoreCache), score_compress = ?(scoreImgCompess) WHERE wpt_id = ?(wptId)`,
		accessRight: 500
	},
	'count-logs': {
		sql:
			`SELECT 
      COUNT(urls_id)
      FROM urls
      WHERE date_time >= ?(startDate) AND date_time < ?(endDate)`,
		accessRight: 500
	},
	'get-urls-by-date': {
		sql:
			`SELECT
      urls_id AS id, domain, url, ip, robot, api, cms, wpt_id as wptId, 
      load_time AS loadTime, ttfb, bytes, http_2 AS http2, location, 
      browser, cdn, date_time, counter, score_cdn AS scorecdn, score_keep_alive AS scorekeepalive, 
      score_gzip AS scoregzip, score_cache AS scorecache, score_compress AS scorecompress, domains.domains_id,
      status_type_id as statusTypeId, status_id AS statusId
      FROM urls
      INNER JOIN domains ON domains.domains_id = urls.domains_id
      LEFT JOIN status ON status.domains_id = urls.domains_id
      WHERE date_time >= ?(startDate) AND date_time < ?(endDate)`,
		accessRight: 500
	},
	'find-url': {
		sql:
			`SELECT urls_id, counter
      FROM urls 
      WHERE url = ?(url) AND date_time >= ?(startDate) AND date_time < ?(endDate)`
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
			(date, api_tests, uniq_tests, total_tests)
			VALUES
			(?(date), ?(api), ?(uniq), ?(total))`
	},
	'get-log-load-data': {
		sql:
			`SELECT 
			load_log_id 
			FROM load_log
			WHERE date = ?(date)`
	},
	'load-log-count-data': {
		sql:
			`SELECT 
			api_tests, uniq_tests, total_tests
			FROM 
			load_log
			WHERE date =?(date)`
	},
	'set-status': {
		sql:
			`INSERT
			INTO status
			(status_type_id, users_id, domains_id)
			VALUES 
			(?(statusTypeId), ?(usersId), ?(domainsId))`
	},
	'update-status': {
		sql:
			`UPDATE
			 status
			 SET status_type_id = ?(statusTypeId), users_id = ?(usersId) 
			 WHERE status_id = ?(statusId)`
	}
};

module.exports = queries;
