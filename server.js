const environment = process.env.NODE_ENV || 'dev';
const config = require("./config/" + environment + ".js");

const express = require('express');
const routes = require('./routes')
const api = express();

// Enable CORS
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

api.use('/', routes);

api.listen(
  config.api.port, () => console.log(
    "RESTful API server started on: ", config.api.port
  )
);

module.exports = api;
