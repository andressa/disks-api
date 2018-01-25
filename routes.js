const routes = require('express').Router();
const helper = require('./helper');

routes.route('/')
  .get((req, res) => {
    if (helper.has_authorization_key(req)) {
      helper.is_authorized(req, function(err, authorized) {
        if (authorized === false) {
          res.status(400).json({
            statusCode: 400,
            message: "Insert a valid token on Header as 'authorization'"
          });
        } else {
          res.status(200).json({
            statusCode: 200,
            message: "Welcome to Disks API",
            payload: {}
          });
        }
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "You need to insert a token as 'authorization' on Header"
      });
    };
  });

routes.route('/*')
  .get((req, res) => {
    res.status(404).json({
      statusCode: 404,
      message: "Route not found!",
      payload: {}
    });
  });

module.exports = routes;
