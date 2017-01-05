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

    describe('with no token', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer `})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => projectMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line`)
        .send(exampleLineData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid project id', function() {
      before(done => projectMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/project/98765/line`)
        .send(exampleLineData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //end of describe testing POST

  describe('testing GET /api/project/projId/line/lineId', (done) => {

    describe('with valid project id and valid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a line', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.projectId).to.equal(`${this.tempProject._id}`);
          done();
        });
      });
    });

    describe('with valid project id and invalid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/1234`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

//not sure if this test is correct....do we need a place to error handle not finding the project? I put it in the line-router, but somehow it doesn't look right...
    describe('with invalid project id and valid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/4747/line/${this.tempLine._id}`)
        .end((err, res) => {
            expect(err).to.not.be.null;
            expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid project id and invalid line id', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/1234/line/5678`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //end of describe testing GET

  describe('testing DELETE /api/project/:projId/line/:lineId', function() {
    describe('with valid lineId', function() {
      before(done => lineMock.call(this, done));

      it('should delete the line and the line from the lines array of the project, and all dependencies (cages and mice)', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          expect(parseInt(`${this.tempProject.lines.length}`)).to.equal(0);
          done();
        })
      });
    });
  });
});
