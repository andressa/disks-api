const environment = process.env.NODE_ENV || 'dev';
const config = require("../config/" + environment + ".js");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.username,
  password: config.mysql.password,
  port: config.mysql.port
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

module.exports = {
  "is_authorized": (token, callback) => {
    connection.query(
      "SELECT id FROM passeidireto.user WHERE authorization='"+token+"';",
      function(err, result) {
        if (err) callback(err, null);
        var is_valid = false;
        if (result.length === 1)
          is_valid = true;
        
        callback(null, is_valid);
      }
    );
  }
};
