'use strict';

module.exports = {
  template: require('./line-container.html'),
  controller: ['$log', 'lineService', lineContainerController],
  controllerAs: 'lineContainerCtrl',
  bindings: {
    project: '<',
  },
};

function lineContainerController($log, lineService){
  $log.debug('init lineContainerCtrl');

  this.currentLineCheck = function(){
    lineService.fetchLines(this.project._id);
  };
}
