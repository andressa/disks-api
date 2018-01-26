const request = require('supertest');
const chai = require('chai');
const should = chai.should(); 
const expect = require('chai').expect;
const api = require('../source/server');

describe('GET /collection/:id?', function() {

  it('should return Http StatusCode 400 if :id is not int', function(done) {
    request(api)
      .get('/collection/n')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping message in case :id is not int', function(done) {
    request(api)
      .get('/collection/n')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        const expected = {
          statusCode: 400,
          message: "You should inform the collection id to retrieve its disks.\nThe id should be a number"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });

  it('should return Http StatusCode 400 in case :id does not exist', function(done) {
    request(api)
      .get('/collection/1000000')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('should return helping mesage in case :id does not exist', function(done) {
    request(api)
      .get('/collection/1000000')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        const expected = {
          statusCode: 400,
          message: "You should pass an existent collection id"
        };
        res.body.should.be.eql(expected);
        done();
      });
  });

  it('should return http status code 200 when the passed :id is valid', function(done) {
    request(api)
      .get('/collection/1')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should return a list of disk objects', function(done) {
    request(api)
      .get('/collection/1')
      .set('Authorization', 'TOKEN')
      .end(function(err, res) {
        res.body.should.be.eql({
          statusCode: 200,
          message: "Success! Retrieved your disks!",
          data: [
            {
              id: 1,
              name: 'Mamonas Assassinas',
              producer: 'Rick Bonadio',
              year: 1995,
              singer: ''
            }
          ]
        })
        done();
      });
  });
});
