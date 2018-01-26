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

  it('shoudl return helping message if "authorization" is missing', function(done) {
    request(api)
      .post('/collection/1')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "You need to insert a token as 'authorization on Header'"
        });
      });
  });
});

