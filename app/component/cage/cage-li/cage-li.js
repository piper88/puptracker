'use strict';

module.exports = {
  template: require('./cage-li.html'),
  controller: ['$log', 'cageService', cageLIController],
  controllerAs: 'cageLICtrl',
  bindings: {
    line: '<',
    cage: '<',
  },
};

function cageLIController($log, cageService){
  $log.debug('init cageLiCtrl');

}
