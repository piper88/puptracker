'use strict';

require('./lib/test-env.js');

//need all the mocks from here up
//clean up DB
const cageMock = require('./lib/cage-mock.js');
const lineMock = require('./lib/line-mock.js');
const projectMock = require('./lib/project-mock.js');
const cleanUpDB = require('./lib/clean-up-mock.js');

//Line and project models
const Line = require('../model/line.js');
const Project = require('../model/project.js');

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server.js');
const serverControl = require('./lib/server-control.js');

const mongoose = require('mongoose');
const Promise = require('bluebird');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

let startDate = new Date(2015, 8, 20).toDateString();

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const exampleCageData = {
  name: 'cage2',
  numberOfMales: 1,
  numberOfFemales: 2,
  breedingStartDate: startDate,
  breedingEndDate: new Date(2017, 3, 27).toDateString(),
  expectedDOB: addDays(startDate, 25),
  numberLittersMonthly: 2,
  expectedTotalPups: 6,
  expectedUsablePups: 3,
};

describe('testing cage router', function(done) {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));
  afterEach(done => cleanUpDB(done));

  describe('testing POST /api/project/:projId/line/:lineId/cage', function() {
    describe('with valid body', function() {
      before(done => lineMock.call(this, done));

      it('should return a cage and add cage to lines cage array', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          Line.findById(this.tempLine._id)
          .then(line => {
            expect(line.cages.length).to.equal(1);
          });
          done();
        });
      });
    });

    describe('with no name', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          // name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no number of males', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          // numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no number of females', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          // numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no breeding start date', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          // breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no breeding end date', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          // breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no expected DOB', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          // expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no number litters monthly', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          // numberLittersMonthly: 2,
          expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no expected total pups', function() {
      before(done => lineMock.call(this, done));

      it('should return a 400 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({
          name: 'cage3',
          numberOfMales: 1,
          numberOfFemales: 2,
          breedingStartDate: startDate,
          breedingEndDate: new Date(2017, 3, 27).toDateString(),
          expectedDOB: addDays(startDate, 25),
          numberLittersMonthly: 2,
          // expectedTotalPups: 6,
          expectedUsablePups: 3,
        })
        .set({Authorization: `Bearer ${this.tempToken}`})
        .set('Character-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with invalid projectId', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/project/1234/line/${this.tempLine._id}/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with invalid lineId', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 not found', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/4747/cage`)
        .send(exampleCageData)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with no body', function() {
      before(done => lineMock.call(this, done));

      it('should return a 404 bad request', (done) => {
        request.post(`${url}/api/project/${this.tempProject._id}/line/${this.tempLine._id}/cage`)
        .send({})
        .set('Character-Type', 'application/json')
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  }); //end of POST tests

});
