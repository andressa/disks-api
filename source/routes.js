const routes = require('express').Router();
const connector = require('./connector');

routes.route('/')
  .get((req, res) => {
    // Check if request has `authorization` on header
    const token = req.headers['authorization'];
    if (token !== undefined) {
      // Check if `authorization is valid for the given token
      connector.is_authorized(token, function(err, authorized) {
        // If it is not authorized, return Http Status Code 401: Not Authorized
        if (authorized === false) {
          res.status(401).json({
            statusCode: 401,
            message: "Insert a valid token on Header as 'authorization'"
          });
        } else {
          // User is authorized. Welcome message should be sent
          res.status(200).json({
            statusCode: 200,
            message: "Welcome to Disks API",
            payload: {}
          });
        }
      });
    } else {
      // Authorization key was not found on header
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
    const token = req.headers['authorization'];
    // Check if request has `authorization` on header
    if (token !== undefined) {
      // Check if `authorization` is valid for the given token
      const token = req.headers['authorization'];
      connector.is_authorized(token, function(err, authorized) {
        // If it is not authorized, return HTTP Status Code 400
        if (authorized === false) {
          res.status(401).json({
            statusCode: 401,
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
            } else { // `id` is a number! Let's check if it is a valid collection
              connector.is_valid_collection(token, collection_id, function(err, is_valid) {
                // collection_id does not exist
                if (!is_valid) {
                  res.status(400).json({
                    statusCode: 400,
                    message: "You should pass an existent collection id"
                  });
                } else { // return all disks from a given collection
                  connector.get_collection_disks(token, collection_id, function(err, disks) {
                    res.status(200).json({
                      statusCode: 200,
                      message: "Success! Retrieved your disks!",
                      data: disks
                    });
                  });
                };
              });
            };
          } else {
            // If id was not passed by parameter, return all collections
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
      // Authorization key was not found on header
      res.status(400).json({
        statusCode: 400,
        message: "You need to insert a token as 'authorization' on Header"
      });
    };
  })
  .post((req, res) => {
    const token = req.headers['authorization'];
    // Check if `authorization` is defined on request header
    if (token !== undefined) {
      // Check if request is authorized
      connector.is_authorized(token, function(err, is_valid) {
        if (!is_valid) { // Authorization token is not valid
          res.status(401).json({
            statusCode: 401,
            message: "Insert a valid token on Header as 'authorization'"
          });
        } else { // Authorization token is valid. Let's move on...
          const collection_id = parseInt(req.params.id);
          if (req.params.id === undefined || req.params.id === '') { // `id` was not passed by parameter
            res.status(400).json({
              statusCode: 400,
              message: "You need to pass by parameter the ID of the collection you are going to insert disk"
            });
          } else { // `id` was passed by parameter...
            if (isNaN(collection_id)) { // ... but, `id` is not a number
              res.status(400).json({
                statusCode: 400,
                message: "Collection ID passed by parameter should be a number"
              });
            } else { // `id` is a number. Cool. Let's move on...
              // Check if collection_id exists
              connector.get_user_collections(token, function(err, collections) {
                var collection_available = false;
                for (var item=0; item < collections.length; item++) {
                  if (collections[item].id === collection_id) {
                    collection_available = true;
                    break;
                  }
                };
                if (!collection_available) { // User has no permission to edit requested collection
                  res.status(401).json({
                    statusCode: 401,
                    message: "The collection id passed by parameter is not available for you."
                  });
                } else { // User is own of requested collection
                  // Check if all required fields were sent
                  const fields = ['name', 'producer', 'year', 'singer'];
                  var missing_field = false;
                  var data = {};
                  for (var item=0; item < fields.length; item++) {
                    data[fields[item]] = req.body[fields[item]];
                    if (!req.body.hasOwnProperty(fields[item])) {
                      res.status(400).json({
                        statusCode: 400,
                        message: "Field `"+ fields[item] +"` is missing in your posted data"
                      }).end();
                      missing_field = true;
                      break;
                    };
                  };
                  if (!missing_field) {
                    connector.insert_disk(token, collection_id, data, function(err, inserted_disk_id) {
                      if (inserted_disk_id !== null)
                        res.status(201).json({
                          statusCode: 201,
                          message: "Nice job! You just created a new disk on your collection!"
                        });
                    });
                  };
                };
              });
            };
          };
        };
      });
    } else { // Authorization key was not found on header
      res.status(400).json({
        statusCode: 400,
        message: "You need to insert a token as 'authorization' on Header"
      });
    };
  })
  .all((req, res) => { // handles all other methods
    res.status(405).json({
      statusCode: 405,
      message: "The requested method is not allowed!"
    });
  });

// Handles not implemented routes
routes.route('/*')
  .get((req, res) => {
    res.status(404).json({
      statusCode: 404,
      message: "Route not found!",
      payload: {}
    });
  });

module.exports = routes;
