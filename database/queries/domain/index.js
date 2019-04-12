const logQueries = {
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
};

module.exports = logQueries;
