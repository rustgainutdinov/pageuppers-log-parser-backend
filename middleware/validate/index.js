function checkRequired(req, param, cb) {
  var regular = param.match(/(.+)\[(.+?)\]/i);
  const name = regular[1];
  const id = regular[2];
  const err = req[name] && req[name][id] ? null : new Error(`Param ${name}[${id}] is required`);
  return cb(err);
}

module.exports = {
  checkRequired
};
