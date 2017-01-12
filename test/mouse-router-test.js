'use strict';

const mouseMock = require('./lib/mouse-mock.js');
const cageMock = require('./lib/cage-mock.js');

const cleanUpDB = require('./lib/clean-up-mock.js');

const Cage = require('../model/cage.js');

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server.js');
const serverControl = require('./lib/server-control.js');

const mongoose = require('mongoose');
const Promise = require('bluebird');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

let exampleMouseData = {
  name: 'emx1-ires-cree;camk2a-tta;ai93-478847',
  geneticMakeup: ['het', 'het', 'wild'],
  DOB: new Date(2017, 1, 22).toDateString(),
  sex: 'male',
};

describe('testing mouse router', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDB(done));

  describe('testing POST /api/project/:projId/line/:lineId/cage/:cageId/mouse', function() {
    describe('with valid body', function() {
      before(done => cageMock.call(this, done));

      it('should return a mouse and add mouse to cages mice array', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send(exampleMouseData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          Cage.findById(this.tempCage._id)
          .then((cage) => {
            expect(cage.mice.length).to.equal(1);
          })
          .catch(err => done(err));
          done();
        });
      });
    });

    describe('with no body', function() {
      before(done => cageMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no name', function() {
      before(done => cageMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send({
          geneticMakeup: ['het', 'het', 'wild'],
          DOB: new Date(2017, 1, 22).toDateString(),
          sex: 'male',
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no genetic makeup', function() {
      before(done => cageMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send({
          name: 'emx1-ires-cree;camk2a-tta;ai93-478847',
          DOB: new Date(2017, 1, 22).toDateString(),
          sex: 'male',
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no DOB', function() {
      before(done => cageMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send({
          name: 'emx1-ires-cree;camk2a-tta;ai93-478847',
          geneticMakeup: ['het', 'het', 'wild'],
          sex: 'male',
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no sex', function() {
      before(done => cageMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send({
          name: 'emx1-ires-cree;camk2a-tta;ai93-478847',
          geneticMakeup: ['het', 'het', 'wild'],
          DOB: new Date(2017, 1, 22).toDateString(),
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send(exampleMouseData)
        .set({Authorization: `Bearer `})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with bad token', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send(exampleMouseData)
        .set({Authorization: `Bearer 7483939`})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => cageMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse`)
        .send(exampleMouseData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of POST tests

  describe('testing GET /api/project/:projId/line/:lineId/cage/:cageId/mouse/:mouseId', function() {
    describe('with valid mouse id', function() {
      before(done => mouseMock.call(this, done));

      it('should return a mouse', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/${this.tempMouse._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with invalid mouse id', function() {
      before(done => mouseMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.get(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/wrongid`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //end of GET tests

  describe('testing DELETE /api/project/:projId/line/:lineId/cage/:cageId/mouse/:mouseId', function() {
    describe('with valid mouse id', function() {
      before(done => mouseMock.call(this, done));

      it('should delete the mouse and the mouse from the cages mice array', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/${this.tempMouse._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          Cage.findById(this.tempCage._id)
          .then((cage) => {
            expect(cage.mice.length).to.equal(0);
          })
          .catch(done);
          done();
        });
      });
    });

    describe('with invalid mouse id', function() {
      before(done => mouseMock.call(this, done));

      it('should delete the mouse and the mouse from the cages mice array', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/mousepoop`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with no token', function() {
      before(done => mouseMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/${this.tempMouse._id}`)
        .set({Authorization: `Bearer `})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid token', function() {
      before(done => mouseMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/${this.tempMouse._id}`)
        .set({Authorization: `Bearer 12345677 `})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no auth header', function() {
      before(done => mouseMock.call(this, done));

      it('should return a 401 unauthorized', (done) => {
        request.delete(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage/${this.tempCage._id}/mouse/${this.tempMouse._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  }); //end of DELETE tests
});
