const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');
const connector = require("../source/connector");

describe('DELETE /disk/:id/', function() {

  it('should return 400 if "authorization" is not in header', function(done) {
    request(api)
      .delete('/disk/1')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if "authorization" is missing', function(done) {
    request(api)
      .delete('/disk/1')
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
      .delete('/disk/1')
      .set('authorization', 'INVALID_TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401)
        done();
      });
  });

  it('should return helping message if "authorization" is invalid', function(done) {
    request(api)
      .delete('/disk/1')
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
      .delete('/disk/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400)
        done();
      });
  });

  it('should return a helping message if :id is not passed by parameter', function(done) {
    request(api)
      .delete('/disk/')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "You need to pass by parameter the ID of the disk you want to delete"
        });
        done();
      });
  });

  it('should return http status code 400 if id passed by parameter is not a number', function(done) {
    request(api)
      .delete('/disk/N')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if id passed by parameter is not a number', function(done) {
    request(api)
      .delete('/disk/N')
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
      .delete('/disk/1000000')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return helping message if the id is not available for user', function(done) {
    request(api)
      .delete('/disk/1000000')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 401,
          message: "The disk id passed by parameter is not available for your deletion."
        });
        done();
      });
  });

  it('should return http status code 200 after deleting by disk id', function(done) {
    const test_insertion = {
      name: 'Monobloco',
      producer: 'Som Livre',
      year: '2006',
      singer: 'Grupo Monobloco'
    };
    connector.insert_disk('TOKEN', 1, test_insertion, function(err, inserted_id) {
      request(api)
        .delete('/disk/' + inserted_id)
        .set('authorization', 'TOKEN')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  it('should return empty object after deleting by disk id', function(done) {
    const test_insertion = {
      name: 'Monobloco',
      producer: 'Som Livre',
      year: '2006',
      singer: 'Grupo Monobloco'
    };
    connector.insert_disk('TOKEN', 1, test_insertion, function(err, inserted_id) {
      request(api)
        .delete('/disk/' + inserted_id)
        .set('authorization', 'TOKEN')
        .end(function(err, res) {
          connector.disk_exists(inserted_id, function(err, result) {
            expect(result).to.equal(false);
          });
          done();
        });
    });
  });
});
