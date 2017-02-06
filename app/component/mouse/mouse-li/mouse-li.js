'use strict';

module.exports = {
  template: require('./mouse-li.html'),
  controller: ['$log', mouseLIController],
  controllerAs: 'mouseLICtrl',
  bindings: {
    cage: '<',
    mouse: '<',
  },
};

function mouseLIController($log){
  $log.debug('init mouseLiCtrl');

}
