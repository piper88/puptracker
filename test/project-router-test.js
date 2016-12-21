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
          // console.log('THE ERRORRRRRRR', err);
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
    });
  }); //end of describe POST
});
