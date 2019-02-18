const queries = require(`${__dirname}/../queries`);

function substituteQuery(query, data, accessRights, cb) {
  const sql = queries[query] ? queries[query] : null;
  if (!sql) {
    return cb(new Error('query is not found'));
  }
  if (sql.accessRights && sql.accessRights > accessRights) {
    return cb(new Error('you have no rights'));
  }

  return cb(null, sql.sql.replace(/\?\((.+?)\)/gi, (_, id) => {
    if (!data) return cb(new Error('data is not defined'));
    if(typeof(data[id]) === "boolean") return data[id] ? 'true' : 'false';
    return data[id] ? `'${data[id]}'` : null;
  }));

}

module.exports = substituteQuery;
