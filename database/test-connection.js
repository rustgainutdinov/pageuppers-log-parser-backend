const pg = require('pg');
const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'page-uppers',
  password: 'gv9y3ytsow',
  port: 5432,
});

// const db = new pg.Client({database: 'page-uppers'});
db.connect((err, client) => {
  if (err) throw err;
  console.log('Connected to database', db.database);
});

db.query('SELECT * FROM domains', (err, result) => {
  if (err) throw err;
  console.log(result);
  db.end();
});
