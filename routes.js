const routes = require('express').Router();


routes.route('/')
  .get(
    (req, res) => {
      res.status(200).json({
        statusCode: 200,
        message: "Welcome to Disks API",
        payload: {}
      });
    }
  );

routes.route('/*')
  .get(
    (req, res) => {
      res.status(404).json({
        statusCode: 404,
        message: "Route not found!",
        payload: {}
      });
    }
  );

module.exports = routes;
