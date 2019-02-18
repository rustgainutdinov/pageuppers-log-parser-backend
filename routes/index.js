'use strict';
exports.notFound = (req, res, next) => {
  res.json('Route is not found');
};

exports.error = (err, req, res, next) => {
  let msg;
  switch (err.type) {
    case 'database':
      msg = 'Server Unavailable';
      res.statusCode = 503;
      break;
    default:
      msg = 'Internal Server error';
      res.statusCode = 500;
  }

  res.json({msg});
};
