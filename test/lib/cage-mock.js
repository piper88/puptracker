'use strict';

const Cage = require('../../model/cage.js');
const debug = require('debug')('puptracker:cage-mock');

const lineMock = require('./line-mock.js');

module.exports = function(done) {
  debug('creating cage for mocking');

  let startDate = new Date(2017, 0, 1).toDateString();

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  let exampleCage = {
    name: 'cage1',
    numberOfMales: 1,
    numberOfFemales: 2,
    breedingStartDate: startDate,
    breedingEndDate: new Date(2017, 2, 27).toDateString(),
    expectedDOB: addDays(startDate, 25),
    numberLittersMonthly: 2,
    expectedTotalPups: 6,
    expectedUsablePups: 3,
  }

  lineMock.call(this, err => {
    if (err) return done(err);
    exampleCage.lineId = this.tempLine._id;
    exampleCage.projectId = this.tempProject._id
    new Cage(exampleCage).save()
    .then(cage => {
      this.tempCage = cage;
      done();
    })
    .catch(done);
  });
};
