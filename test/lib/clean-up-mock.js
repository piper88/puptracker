'use strict';

const debug = require('debug')('puptracker:clean-up-mock');

const User = require('../../model/user.js');
const Project = require('../../model/project.js');
const Line = require('../../model/line.js');
const Cage = require('../../model/cage.js');


module.exports = function(done){
  debug('cleaning up database');

  Promise.all([
    User.remove({}),
    Project.remove({}),
    Line.remove({}),
    Cage.remove({}),
  ])
  .then(() => done())
  .catch(done);
};
