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

}
