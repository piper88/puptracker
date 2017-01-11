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
  });
});
