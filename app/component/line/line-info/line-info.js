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

}
