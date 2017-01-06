'use strict';

const Line = require('../../model/line.js');
const debug = require('debug')('puptracker:line-mock');

// const userMock = require('./user-mock.js');
const projectMock = require('./project-mock.js');

module.exports = function(done){
  debug('line mock for testing');

  let exampleLine = {
    name: 'piper',
    genes: ['47', 'piper', 'poop8'],
  };

  projectMock.call(this, err => {
    if (err) return done(err);
    exampleLine.projectId = this.tempProject._id;
    new Line(exampleLine).save()
    .then(line => {
      this.tempLine = line;
      done();
    })
    .catch(done);
  });
};
