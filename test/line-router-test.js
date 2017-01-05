'use strict';

require('./lib/test-env.js');

const projectMock = require('./lib/project-mock.js');
const lineMock = require('./lib/line-mock.js');
// const userMock = require('./lib/user-mock.js');
const cleanUpDB = require('./lib/clean-up-mock.js');

const Project = require('../model/project.js');

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

      it('should return a line and add line to projects line array ', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          Project.findById(this.tempProject._id)
          .then(project => {
            expect(project.lines.length).to.equal(1);
          });
          done();
        });
      }); //end of it should return a line
    });

    describe('with invalid body', function() {
      before(done => projectMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send({poop: 'ypants'})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      }); //end of it should return a 400 bad request
    }); //end of describe with invalid body

    describe('with no body', function() {
      before(done => projectMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send({})
        .set('Character-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer 1234`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of describe testing POST
});