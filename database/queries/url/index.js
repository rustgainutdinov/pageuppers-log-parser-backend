const urlQueries = {
	'set-status': {
		sql:
			`INSERT
			INTO status
			(status_type_id, users_id, domains_id)
			VALUES 
			(?(statusTypeId), ?(usersId), ?(domainsId))`
	},
	'update-status-first-time': {
		sql:
			`UPDATE
			 status
			 SET status_type_id = ?(statusTypeId), users_id = ?(usersId), date_of_change = NOW(), load_log_id = (SELECT load_log_id FROM urls WHERE urls_id = ?(urlId))
			 WHERE status_id = ?(statusId)`
	},
	'update-status': {
		sql:
			`UPDATE
			 status
			 SET status_type_id = ?(statusTypeId), date_of_change = NOW()
			 WHERE status_id = ?(statusId)`
	},
	'get-urls-by-load-log-id': {
		sql:
			`SELECT
      urls_id AS id, domain, url, ip, robot, api, cms, wpt_id as wptId, 
      load_time AS loadTime, ttfb, bytes, http_2 AS http2, location, 
      browser, cdn, date_time, counter, score_cdn AS scorecdn, score_keep_alive AS scorekeepalive, 
      score_gzip AS scoregzip, score_cache AS scorecache, score_compress AS scorecompress, domains.domains_id AS domainsid,
      status_type_id as statusTypeId, status_id AS statusId
      FROM urls
      INNER JOIN domains ON domains.domains_id = urls.domains_id
      LEFT JOIN status ON status.domains_id = urls.domains_id
      WHERE urls.load_log_id = ?(logId)`,
		accessRight: 500
	},
	'find-url': {
		sql:
			`SELECT urls_id, counter
      FROM urls 
      WHERE url = ?(url) AND date_time >= ?(startDate) AND date_time < ?(endDate)`
	},
	'insert-url': {
		sql:
			`INSERT 
      INTO urls
      (domains_id, url, ip, location, browser, wpt_id, date_time, api, counter, load_log_id)
      VALUES
      (?(domainsId), ?(url), ?(ip), ?(location), ?(browser), ?(wptId), ?(dateTime), ?(api), ?(counter), ?(logId))`,
		accessRight: 500
	},
	'update-url': {
		sql: `UPDATE urls
      SET load_time = ?(loadTime), ttfb = ?(ttfb), bytes = ?(bytes), cdn = ?(cdn), score_cdn = ?(scoreCdn), score_keep_alive = ?(scoreKeepAlive), score_gzip = ?(scoreCompress), score_cache = ?(scoreCache), score_compress = ?(scoreImgCompess) WHERE wpt_id = ?(wptId)`,
		accessRight: 500
	},
	'get-urls-by-start-end-date': {
		sql:
			`SELECT * FROM urls
			INNER JOIN load_log l on l.load_log_id = l.load_log_id
			INNER JOIN domains d2 on urls.domains_id = d2.domains_id
			INNER JOIN status s2 on d2.domains_id = s2.domains_id
			INNER JOIN status_type st on s2.status_type_id = st.status_type_id
			WHERE date >= ?(startDate) AND date < ?(endDate)
			AND NOT (name = 'empty')
			AND date_of_change IS NOT NULL
			AND urls.load_log_id = s2.load_log_id
			ORDER BY date_of_change DESC`
	}
};

module.exports = urlQueries;
