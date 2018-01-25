const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../server');

describe('GET /', function () {

  it('should return 400 if "authorization" not in header', function(done) {
    request(api)
      .get('/')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if "authorization" is missing', function(done) {
    request(api)
      .get('/')
      .end(function(err, res) {
        const expected = {
          statusCode: 400,
          message: "You need to insert a token as 'authorization' on Header"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });

  it('should return StatusCode 400 when passing wrong token', function(done) {
    request(api)
      .get('/')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done();
      });
  });

  it('should return helping message if "authorization" is invalid', function(done) {
    request(api)
      .get('/')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        const expected = {
          statusCode: 400,
          message: "Insert a valid token on Header as 'authorization'"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });

  it('should return HttpStatusCode 200', function (done) {
    request(api)
      .get('/')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should return JSON object', function(done) {
    request(api)
      .get('/')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        const expected = {
          statusCode: 200,
          message: "Welcome to Disks API",
          payload: {}
        };
        res.body.should.be.eql(expected);
        done();
      });
  });
});

describe('GET /whatever', function() {

  it('should return HttpStatusCode 404', function(done) {
    request(api)
      .get('/whatever')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should return JSON object', function(done) {
    request(api)
      .get('/whatever')
      .end(function(err, res) {
        var expected = {
          statusCode: 404,
          message: 'Route not found!',
          payload: {}
        };
        res.body.should.be.eql(expected);
        done();
      })
  });
});
