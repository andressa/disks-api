const routes = require('express').Router();
const controller = require('./controller');
const connector = require('./connector');

routes.route('/')
  .get((req, res) => {
    if (controller.has_authorization_key(req)) {
      const token = req.headers['authorization'];
      connector.is_authorized(token, function(err, authorized) {
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
  })
  .all((req, res) => {
    res.status(405).json({
      statusCode: 405,
      message: "The requested method is not allowed!"
    });
  });

routes.route('/collection')
  .get((req, res) => {
    if (controller.has_authorization_key(req)) {
      const token = req.headers['authorization'];
      connector.is_authorized(token, function(err, authorized) {
        if (authorized === false) {
          res.status(400).json({
            statusCode: 400,
            message: "Insert a valid token on Header as 'authorization'"
          });
        } else {
          const token = req.headers['authorization'];
          connector.get_user_collections(token, function(err, collections) {
            res.status(200).json({
              statusCode: 200,
              message: "Success! Retrieved your collections.",
              data: collections
            });
          });
        }
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "You need to insert a token as 'authorization' on Header"
      });
    };
  })
  .all((req, res) => {
    res.status(405).json({
      statusCode: 405,
      message: "The requested method is not allowed!"
    });
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
