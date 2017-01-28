'use strict';

module.exports = {
  template: require('./project-container.html'),
  controller: ['$log', 'lineService', projectContainerController],
  controllerAs: 'projectContainerCtrl',
  bindings: {
    project: '<',
  },
};

function projectContainerController($log, lineService){
  $log.debug('init projectContainerCtrl');

  this.returnLines = function(){
    lineService.fetchLines(this.project._id);
  };

}
