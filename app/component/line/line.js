'use strict';

//require('./_line.scss');

module.exports = {
  template: require('./line.html'),
  controller: ['$log', LineController],
  controllerAs: 'LineCtrl',
  // bindings: {
  //   line: '<',
  //   project: '<',
  // },
};

function LineController($log){
  $log.debug('init LineCtrl');


}
