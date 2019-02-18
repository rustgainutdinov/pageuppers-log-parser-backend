const queries = {
  'test-select': {
    sql: `SELECT cdn from urls WHERE wpt_id = '190202_00_67083ef37280f0cb02f1727883c71d70';`,
    accessRight: 900
  },
  'test-insert': {
    sql: `INSERT INTO users(users_id, name, last_name, email, pass) VALUES('382f6fdf-33a6-467b-89aa-62320d563be7', 'name', 'last_name', 'email', 'pass');`,
    accessRight: 900
  },
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
  'insert-url': {
    sql:
      `INSERT 
      INTO urls
      (domains_id, url, ip, location, browser, wpt_id, date_time) 
      VALUES
      (?(domainsId), ?(url), ?(ip), ?(location), ?(browser), ?(wptId), ?(dateTime))`,
    accessRight: 500
  },
  'update-url': {
    sql: `UPDATE urls
      SET load_time = ?(loadTime), ttfb = ?(ttfb), bytes = ?(bytes), cdn = ?(cdn) WHERE wpt_id = ?(wptId)`,
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
      urls_id AS id, domain, url, ip, robot, cms, wpt_id as wptId, load_time AS loadTime, ttfb, bytes, http_2 AS http2, location, browser, cdn, date_time
      FROM urls
      INNER JOIN domains ON domains.domains_id = urls.domains_id
      WHERE date_time >= ?(startDate) AND date_time < ?(endDate)`,
    accessRight: 500
  }
};

module.exports = queries;
