'use strict';

const Mouse = require('../../model/cage.js');
const debug = require('debug')('puptracker:mouse-mock');

const cageMock = require('./cage-mock.js');


module.exports = function(done) {
  debug('mouse mock for testing');

  let exampleMouse = {
    name: 'emx1-ires-cree;camk2a-tta;ai93-123456',
    geneticMakeup: ['het', 'homo', 'wild'],
    DOB: new Date(2017, 0, 15).toDateString(),
    sex: 'female',
    breeder: true,
  };

  cageMock.call(this, err => {
    if (err) return done(err);

    exampleMouse.cageId = this.tempCage._id;
    exampleMouse.lineId = this.tempLine._id;
    exampleMouse.projectId = this.tempProject._id;
    new Mouse(exampleMouse).save()
    .then((mouse) => {
      this.tempMouse = mouse;
      done();
    })
    .catch(done);
  });
};
//example mouse

//cageMock.call(this, err => {
  //set the project id, line id, and cage id of the mouse, then save the mouse, then set tempMouse = mouse
//});
