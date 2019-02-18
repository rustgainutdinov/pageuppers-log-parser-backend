const pg = require('pg');
const connection = require(`${__dirname}/connection`);
const substituteQuery = require(`${__dirname}/sql`);

let db;

db = new pg.Client(connection);
db.connect((err, client) => {
  if (err) return cb(err);
});

function execute(query, data, accessRights, cb) {
  substituteQuery(query, data, accessRights, (err, sql) => {
    if (err) return cb(err);

    db.query(sql, (err, result) => {
      if (err) return cb(err);
      return cb(null, result ? result.rows : null);
    })
  });
}

module.exports = {
  execute
};
