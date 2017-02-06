'use strict';

module.exports = {
  template: require('./cage-info.html'),
  controller: ['$log', CageInfoController],
  controllerAs: 'cageInfoCtrl',
  bindings: {
    cage: '<',
  },
};


function CageInfoController($log){
  $log.debug('init cageInfoCtrl');

  // let numFemales = this.cage.numberofFemales;
  // let breedingStartDate = this.cage.breedingStartDate;
  let litterSize = 6;
  // Do they input this value?
  let usablePercent = .25;

  // this.expectedTotalPups = litterSize * numFemales;
  // this.expectedUsablePups = numFemales * litterSize * usablePercent;
  // this.breedingEndDate = breedingStartDate + 22;
}
