const connector = require('./connector');

module.exports = {
  'has_authorization_key': (req) => {
    if (req.headers['authorization'] === undefined) {
      return false;
    };
    return true;
  }
};
