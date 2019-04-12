const userQueries = {
	'create-user': {
		sql:
			`INSERT INTO 
      users(name, last_name, email, pass, auth_token, access_rights_id) 
      VALUES 
      (?(name), ?(lastName), ?(email), ?(pass), ?(authToken), 'e7a1ad57-f885-4143-99cc-7b99f0a97d7b');`,
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
};

module.exports = userQueries;
