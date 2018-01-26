const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');
const connector = require("../source/connector");

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

  it('should return http status code 400 if id passed by parameter is not a number', function(done) {
    request(api)
      .post('/collection/N')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if id passed by parameter is not a number', function(done) {
    request(api)
      .post('/collection/N')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "Collection ID passed by parameter should be a number"
        });
        done();
      });
  });

  it('should return http status code 401 if id is invalid for user', function(done) {
    request(api)
      .post('/collection/1000000')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('should return helping message if the id is not available for user', function(done) {
    request(api)
      .post('/collection/1000000')
      .set('authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 401,
          message: "The collection id passed by parameter is not available for you."
        });
        done();
      });
  });

  // Required fields: name, producer, year, singer
  it('should return http status code 400 if `name` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        year: 2000,
        singer: ''
      })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if `name` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        year: 2000,
        singer: ''
      })
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "Field `name` is missing in your posted data"
        });
        done();
      });
  });

  it('should return http status code 400 if `producer` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        year: 2000,
        singer: ''
      })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if `producer` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        year: 2000,
        singer: ''
      })
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "Field `producer` is missing in your posted data"
        });
        done();
      });
  });

  it('should return http status code 400 if `year` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        singer: ''
      })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if `year` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        singer: ''
      })
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "Field `year` is missing in your posted data"
        });
        done();
      });
  });

  it('should return http status code 400 if `singer` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        year: 2000
      })
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message if `singer` field is missing', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        year: 2000
      })
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 400,
          message: "Field `singer` is missing in your posted data"
        });
        done();
      });
  });

  it('should return 201 if disk is created', function(done) {
    request(api)
      .post('/collection/1')
      .set('authorization', 'TOKEN')
      .send({
        name: 'MTV ao Vivo (Raimundos)',
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        year: 2000,
        singer: ''
      })
      .end(function(err, res) {
        expect(res.status).to.equal(201);
        res.body.should.be.eql({
          statusCode: 201,
          message: "Nice job! You just created a new disk on your collection!"
        });
      });
      connector.delete_disk({
        name: 'MTV ao Vivo (Raimundos)',
        producer: 'Mauro Manzoli, Tom Capone e Carlos Eduardo Miranda',
        year: 2000,
        singer: ''
      });
      done();
  });
});

