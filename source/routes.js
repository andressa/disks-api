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

routes.route('/collection/:id?')
  .get((req, res) => {
    // Check if request has `authorization` on header
    if (controller.has_authorization_key(req)) {
      // Check if `authorization` is valid for the give token
      const token = req.headers['authorization'];
      connector.is_authorized(token, function(err, authorized) {
        // If it is not authorized, return HTTP Status Code 400
        if (authorized === false) {
          res.status(400).json({
            statusCode: 400,
            message: "Insert a valid token on Header as 'authorization'"
          });
        } else {
          // User is authorized. Let's move on handling the request.
          // Check if id was passed by parameter
          if (req.params.id !== undefined) {
            // If `id` passed by parameter is not `int`,
            // returns Http Status Code 400
            const collection_id = parseInt(req.params.id);
            if (isNaN(collection_id)) {
              res.status(400).json({
                statusCode: 400,
                message: "You should inform the collection id to retrieve its disks.\nThe id should be a number"
              });
            };
          } else {
            // If id was not passed by parameter, return all collections
            const token = req.headers['authorization'];
            connector.get_user_collections(token, function(err, collections) {
              res.status(200).json({
                statusCode: 200,
                message: "Success! Retrieved your collections.",
                data: collections
              });
            });
          }
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
