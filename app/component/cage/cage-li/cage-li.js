'use strict';

module.exports = {
  template: require('./cage-li.html'),
  controller: ['$log', cageLIController],
  controllerAs: 'cageLICtrl',
  bindings: {
    line: '<',
    cage: '<',
  },
};

function cageLIController($log){
  $log.debug('init cageLiCtrl');

}
