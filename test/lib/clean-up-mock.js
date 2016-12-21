'use strict';

const debug = require('debug')('puptracker:clean-up-mock');

const User = require('../../model/user.js');
const Project = require('../../model/project.js');


module.exports = function(done){
  debug('cleaning up database');

  Promise.all([
    User.remove({}),
    Project.remove({})
  ])
  .then(() => done())
  .catch(done);
};
