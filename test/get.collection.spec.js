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

});