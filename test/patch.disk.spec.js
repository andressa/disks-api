const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');
const connector = require("../source/connector");

describe('PATCH /disk/:id/', function() {

  it('should return 405 if method is not implemented', function(done) {
    request(api)
      .copy('/disk/1')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(405);
        done();
      });
  });

  it('should return helping message if method is not implemented', function(done) {
    request(api)
      .copy('/disk/1')
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
      .patch('/disk/1')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if "authorization" is missing', function(done) {
    request(api)
      .patch('/disk/1')
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
      .patch('/disk/1')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done();
      });
  });

  it('should return helping message if "authorization" is invalid', function(done) {
    request(api)
      .patch('/disk/1')
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
      .patch('/disk/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done();
      });
  });

  it('should return a helping message if :id is not passed by parameter', function(done) {
    request(api)
      .patch('/disk/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "You need to pass by parameter the ID of the disk you want to edit"
        });
        done();
      });
  });

  it('should return http status code 400 if id passed by parameter is not a number', function(done) {
    request(api)
      .patch('/disk/N')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if id passed by parameter is not a number', function(done) {
    request(api)
      .patch('/disk/N')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "Disk ID passed by parameter should be a number"
        });
        done();
      });
  });

  it('should return http status code 401 if id is invalid for user', function(done) {
    request(api)
      .patch('/disk/1000000')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return helping message if the id is not available for user', function(done) {
    request(api)
      .patch('/disk/1000000')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 401,
          message: "The disk id passed by parameter is not available for your edition."
        });
        done();
      });
  });

  it('should return http status code 400 if no valid field is sent', function(done) {
    request(api)
      .patch('/disk/1')
      .set('authorization', 'TOKEN')
      .send({
        invalid: true
      })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if no valid field is sent', function(done) {
    request(api)
      .patch('/disk/1')
      .set('authorization', 'TOKEN')
      .send({
        invalid: true
      })
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "You should send at least one valid field to edit, such as: `name`, `producer`, `year` or `singer`"
        });
        done();
      });
  });

  it('should return http status code 200', function(done) {
    request(api)
      .patch('/disk/1')
      .set('authorization', 'TOKEN')
      .send({
        name: "Mamonas Assassinas (ao vivo)",
        blabous: "blaaeeubous"
      })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        connector.get_disk(1, function(err, result) {
          result.should.be.eql({
            name: 'Mamonas Assassinas (ao vivo)',
            producer: 'Rick Bonadio',
            year: 1995,
            singer: ''
          });
        });
        connector.edit_disk(1, "name='Mamonas Assassinas'", function(_, _){});
        done();
      });
  });

  it('should return success message after updating disk', function(done) {
    request(api)
      .patch('/disk/1')
      .set('authorization', 'TOKEN')
      .send({
        year: 1994
      })
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 200,
          message: "Updated disk with id 1!"
        });
        connector.get_disk(1, function(err, result) {
          result.should.be.eql({
            name: 'Mamonas Assassinas',
            producer: 'Rick Bonadio',
            year: 1994,
            singer: ''
          });
        });
        connector.edit_disk(1, "year=1995", function(_, _){});
        done();
      });
  });

});
