'use strict';

require('./lib/test-env.js');

const projectMock = require('./lib/project-mock.js');
const lineMock = require('./lib/line-mock.js');
// const userMock = require('./lib/user-mock.js');
const cleanUpDB = require('./lib/clean-up-mock.js');

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server.js');
const serverControl = require('./lib/server-control.js');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleLineData = {
  name: 'cree',
};

describe('testing line router', function(done) {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDB(done));

  describe('testing POST /api/project/:projId/line', function() {
    describe('with valid body', function() {
      //to post a line, have to have a project to post to
      before(done => projectMock.call(this, done));

      it('should return a line', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      }); //end of it should return a line
    });
  }); //end of describe testing POST
});
