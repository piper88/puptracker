'use strict';

const debug = require('debug')('puptracker:user-mock');

const User = require('../../model/user.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('creating user mock');
  let username = lorem({count: 2, units: 'word'}).split(' ').join('-');
  let password = lorem({count: 2, units: 'word'}).split(' ').join('-');

  let exampleUser = {
    username,
    password,
  };
  //need to save user in 'this.tempUser' along with the other properties (e.g. tempPassowrd) so you can access them in the tests, and send the temp user in the request
  this.tempPassword = password;
  //does this line actually save it in the db, and then the user.save() saves it for the test purposes?
  new User(exampleUser)
  .generatePasswordHash(exampleUser.password)
  //why is user.save() necessary when you already created a new User
  .then(user => user.save())
  .then(user => {
    this.tempUser = user;
    //calling the methods on the User, so is it user or User??????
    return user.generateToken();
  })
  .then(token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};
