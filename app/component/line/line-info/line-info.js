'use strict';

module.exports = {
  template: require('./line-info.html'),
  controller: ['$log', 'lineService', LineInfoController],
  controllerAs: 'lineInfoCtrl',
  bindings: {
    line: '<',
  },
};

function LineInfoController($log){
  $log.debug('init lineInfoCtrl');

  // Number of breeding females
  let numFemales = 10;

  // Number of breeding females * Litter Size(6)
  this.expectedTotalPups = 6 * numFemales;

}
