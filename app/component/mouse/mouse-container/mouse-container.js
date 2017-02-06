'use strict';

module.exports = {
  template: require('./mouse-container.html'),
  controller: ['$log', 'mouseService', mouseContainerController],
  controllerAs: 'mouseContainerCtrl',
  bindings: {
    cage: '<',
  },
};

function mouseContainerController($log, mouseService){
  $log.debug('init mouseContainerCtrl');

  this.currentMouseCheck = function(){
    mouseService.fetchMice(this.cage._id);
  };
}
