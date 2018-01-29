const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');
const connector = require("../source/connector");

describe('GET /search/', function() {
  it('should return 405 if method is not implemented', function(done) {
    request(api)
      .copy('/search/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(405);
        done();
      });
  });

  it('should return helping message if method is not implemented', function(done) {
    request(api)
      .copy('/search/')
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

  it('should return 400 if "authorization" is not in header', function(done) {
    request(api)
      .get('/search/')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if "authorization" is missing', function(done) {
    request(api)
      .get('/search')
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
      .get('/search')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done();
      });
  });

  it('should return helping message if "authorization" is invalid', function(done) {
    request(api)
      .get('/search')
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

  it('should return http status code 200 with no filter if no parameter is passed', function(done) {
    request(api)
      .get('/search')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("should return all disks if no parameter is passed", function(done) {
    request(api)
      .get('/search')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 200,
          data: [{
            name: 'Mamonas Assassinas',
            producer: 'Rick Bonadio',
            year: 1995,
            singer: ''
          }]
        });
        done();
      });
  });

  it('should return http status code 204 if empty list is returned', function(done) {
    request(api)
      .get('/search/?name="MTV Ao Vivo"')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(204);
        done();
      });
  });

  it('should return Mamonas Assassinas disk if search by producer', function(done) {
    request(api)
      .get('/search/?producer="Rick"')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 200,
          data: [{
            name: 'Mamonas Assassinas',
            producer: 'Rick Bonadio',
            year: 1995,
            singer: ''
          }]
        });
        done();
      });
  });
});
