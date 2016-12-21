'use strict';

const Project = require('../../model/project.js');
const debug = require('debug')('puptracker:project-mock');

const userMock = require('../lib/user-mock.js');

module.exports = function(done) {
  debug('project mock for testing');

  //what do you want to do here? create a fake project that has a fake user ID, that comes from the userMock

  //create an example project with all the properties from the project model
  let exampleProject = {
    name: 'CAM',
  };

  //use call to gain access to the userMock methods
  userMock.call(this, err => {
    if (err) return done(err);
    exampleProject.userId = this.tempUser._id;
    new Project(exampleProject).save()
    .then(project => {
      this.tempProject = project;
      done();
    })
    .catch(done);
  });
};
