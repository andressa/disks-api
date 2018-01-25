const connector = require('./connector');

module.exports = {
  'has_authorization_key': (req) => {
    if (req.headers['authorization'] === undefined) {
      return false;
    };
    return true;
  },
  'is_authorized': (req, callback) => {
    connector.is_authorized(req.headers['authorization'], function(err, is_valid) {
      callback(null, is_valid);
    });
  }
};
