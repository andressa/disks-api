module.exports = {
  'mysql': {
    'host': process.env.MYSQL_HOST || '0.0.0.0',
    'username': process.env.MYSQL_USERNAME || 'api-user',
    'password': process.env.MYSQL_PASSWORD,
    'port': 3306 || process.env.MYSQL_PORT
  },
  'api': {
    'port': process.env.API_PORT || 3000
  }
};

