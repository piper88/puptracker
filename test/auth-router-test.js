// 'use strict';
//
// require('./lib/test-env.js');
//
// const authRouter = require('../route/auth-router.js');
// const userMock = require('./lib/user-mock.js');
// const cleanUpDB = require('./lib/clean-up-mock.js');
//
// const expect = require('chai').expect;
// //will make the fake requests for us
// const request = require('superagent');
// //need to pass the server to the server control
// const server = require('../server.js');
// const serverControl = require('./lib/server-control.js');
// //not sure why we need mongoose and bluebird...
// const mongoose = require('mongoose');
// const Promise = require('bluebird');
//
// const url = `http://localhost:${process.env.PORT}`;
//
// //sets the mongoose promise library to bulebird, could also say:
// // mongoose.Promise = require('bluebird');
// mongoose.Promise = Promise;
//
// describe('testing auth router', function(done) {
//     before(done => serverControl.serverUp(server, done));
//     after(done => serverControl.serverDown(server, done));
//     afterEach(done => cleanUpDB(done));
//
//     describe('testing POST /api/signup', function() {
//       describe('with valid body', function() {
//         it('should return a token', (done) => {
//           request.post(`${url}/api/signup`)
//           .send({
//             username: 'prungy88',
//             password: 'goodpassword',
//           })
//           .end((err, res) => {
//             if (err) return done(err);
//             expect(res.status).to.equal(200);
//             done();
//           });
//         }); //end of it should return a token
//
//       }); //end of describe with valid body
//       describe('with invalid body', function() {
//         it('should return a 400 bad request', (done) => {
//           request.post(`${url}/api/signup`)
//           .send('wrong')
//           .end((err, res) => {
//             expect(res.status).to.equal(400);
//             done();
//           })
//         }); //end of it should return 400 bad request
//       }); //end of describe with invalid body
//       describe('with no body', function() {
//         it('should return a 400 bad request', (done) => {
//           request.post(`${url}/api/signup`)
//           .send()
//           .set('Character-Type', 'application/json')
//           .end((err, res) => {
//             expect(res.status).to.equal(400);
//             done();
//           });
//         }); // end of it should return a 400 bad request
//       }); //end of describe with no body
//       describe('with no username', function() {
//         before(done => userMock.call(this, done));
//         it('should return a 400 bad request', (done) => {
//           request.post(`${url}/api/signup`)
//           .send({
//             password: this.tempPassword,
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(400);
//             done();
//           })
//         }); //end of it should return a 400 bad request
//       }); //end of describe with no email
//       describe('with no password', function() {
//         before(done => userMock.call(this, done));
//         it('should return a 400 bad request', (done) => {
//           request.post(`${url}/api/signup`)
//           .send({
//             username: this.tempUser.username,
//           })
//           .end((err, res) => {
//             expect(res.status).to.equal(400);
//             done();
//           })
//         }); //end of it should return a 400 bad request
//       }); //end of describe with no password
//
//       describe('with duplicate username', function() {
//         before(done => userMock.call(this, done));
//         it('should return a 409 error', (done) => {
//           request.post(`${url}/api/signup`)
//           .send({
//             username: this.tempUser.username,
//             password: this.tempPassword,
//           })
//           .end((err, res) => {
//             // console.log('!!!!!!', res);
//             expect(res.status).to.equal(409);
//             done();
//           })
//         });
//       });
//     }); //end of POST tests
//     describe('testing GET /api/login', function() {
//       describe('with valid username and password', function() {
//         before(done => userMock.call(this, done));
//         it('should return a 200 status', (done) => {
//           request.get(`${url}/api/login`)
//           .auth(this.tempUser.username, this.tempPassword)
//           // .send({
//           //   username: this.tempUser.username,
//           //   password: this.tempPassword,
//           // })
//           .end((err, res) => {
//             expect(res.status).to.equal(200);
//             done();
//           })
//         }); //end of it should return a 200 status
//       }); //end of describe with valid username and password
//       describe('with valid username and no password', function() {
//         before(done => userMock.call(this, done));
//         it('should return a 400 bad request', (done) => {
//           request.get(`${url}/api/login`)
//           .auth(this.tempUser.username)
//           .end((err, res) => {
//             expect(res.status).to.equal(401);
//             done();
//           })
//         }); //end of it should return a 400 bad request
//       }); //end of describe with valid username and no password
//       describe('with no username and valid password', function() {
//         before(done => userMock.call(this, done));
//         it('should return a 400 bad reuqest', (done) => {
//           request.get(`${url}/api/login`)
//           .auth(this.tempUser.password)
//           // .send({
//           //   password: this.tempUser.password,
//           // })
//           .end((err, res) => {
//             expect(res.status).to.equal(401);
//             done();
//           })
//         });
//       }); //end of describe with no username and valid passowrd
//
//     }); //end of describe testing GET to /api/login
// });
