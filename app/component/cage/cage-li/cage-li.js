'use strict';

// require('./_cage-li.scss');

module.exports = {
  template: require('./cage-li.html'),
  controller: ['$log', cageLIController],
  controllerAs: 'cageLICtrl',
  bindings: {
    line: '<',
    project: '<',
    cage: '<',
  },
};

function cageLIController($log){
  $log.debug('init cageLiCtrl');
}
