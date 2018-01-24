const environment = process.env.NODE_ENV || 'dev';
const config = require("./config/" + environment + ".js");

const mysql = require("mysql");
const express = require('express');
const api = express();

api.listen(config.api.port);

console.log("RESTful API server started on: ", config.api.port);
