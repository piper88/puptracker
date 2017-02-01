'use strict';

module.exports = {
  template: require('./cage-container.html'),
  controller: ['$log', 'cageService', cageContainerController],
  controllerAs: 'cageContainerCtrl',
  bindings: {
    line: '<',
  },
};

function cageContainerController($log, cageService){
  $log.debug('init cageContainerCtrl');

  this.currentCageCheck = function(){
    cageService.fetchCages(this.line._id);
  };


}
