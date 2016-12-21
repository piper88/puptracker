'use strict';

require('./lib/test-env.js');

// const projectRouter = require('../route/project-router.js');
const projectMock = require('./lib/project-mock.js');
const userMock = require('./lib/user-mock.js');
const cleanUpDB = require('./lib/clean-up-mock.js');

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server.js');
const serverControl = require('./lib/server-control.js');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleProjectData = {
  name: 'IVSCC',
};

describe('testing project router', function(done) {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDB(done));

  describe('testing POST /api/project', function() {
    describe('with valid body', function() {
      before(done => userMock.call(this, done));

      it('should return a project', (done) => {
        request.post(`${url}/api/project`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleProjectData)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
        // done();
      }); //end of it should return a project
    }); //end of valid body

    describe('with invalid body', function() {
      before(done => userMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send('INVALID')
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          // console.log('THE SECOND ERRORRRRRRRRR', err);
          // if (err) return done(err);
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of describe with invalid body

    describe('with no body', function() {
      before(done => userMock.call(this, done));
      it('should return a 400 bad request', (done) => {

        request.post(`${url}/api/project`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send()
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); //end of describe with no body

    describe('with invalid token', function() {
      before(done => userMock.call(this, done));
      it('should return a 401 unauthorized', (done) => {

        request.post(`${url}/api/project`)
        .set({Authorization: `Bearer badtoken`})
        .send(exampleProjectData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    }); //end of describe with invalid token

    describe('with duplicate project name', function() {
      before(done => projectMock.call(this, done));

      it('should return a 409 duplicate error', (done) => {
        request.post(`${url}/api/project`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send({
          name: this.tempProject.name,
        })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          done();
        });
      }); //end of it should return 409
      // before(done => userMock.call(this, done));
    });
  }); //end of describe POST

  describe('testing GET /api/project/:id', function() {
    describe('with valid project ID and token', function() {
      before(done => projectMock.call(this, done));

      it('should return a project', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      }); //end of it should return a project
    }); //end of describe with valid project ID and token

    describe('with valid projectID and invalid token', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}`)
        .set({Authorization: 'Bearer badtoken'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      }); //end of it should return 401
    }); //end of describe with valid id and invalid token

    describe('with invalid projectID and valid token', function() {
      before(done => projectMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    }); //end of describe with invalid
  }); //end of describe GET
});
