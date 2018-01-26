const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');

describe('POST /collection/:id/', function() {

  it('should return 400 if "authorization" is not in header', function(done) {
    request(api)
      .post('/collection/1')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if "authorization" is missing', function(done) {
    request(api)
      .post('/collection/1')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "You need to insert a token as 'authorization' on Header"
        });
        done();
      });
  });

  it('should return StatusCode 401 when passing wrong token', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done();
      });
  });

  it('should return helping message if "authorization" is invalid', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        const expected = {
          statusCode: 401,
          message: "Insert a valid token on Header as 'authorization'"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });

  it('should return http status code 400 if :id is not passed by parameter', function(done) {
    request(api)
      .post('/collection/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done();
      });
  });

  it('should return a helping message if :id is not passed by parameter', function(done) {
    request(api)
      .post('/collection/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "You need to pass by parameter the ID of the collection you are going to insert disk"
        });
        done();
      });
  });

});

