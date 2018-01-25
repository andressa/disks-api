const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');

describe('GET /collection', function() {

  it('should return 405 if method is not implemented', function(done) {
    request(api)
      .post('/collection')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(405);
        done();
      });
  });

  it('should return helping message if method is not implemented', function(done) {
    request(api)
      .put('/collection')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        const expected = {
          statusCode: 405,
          message: "The requested method is not allowed!"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });

  it('should return HttpStatusCode 200', function(done) {
    request(api)
      .get('/collection')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should return 400 if "authorization" is not in header', function(done) {
    request(api)
      .get('/collection')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if "authorization" is missing', function(done) {
    request(api)
      .get('/collection')
      .end(function(err, res) {
        const expected = {
          statusCode: 400,
          message: "You need to insert a token as 'authorization' on Header"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });


});
