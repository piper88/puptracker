'use strict';

module.exports = {
  template: require('./line-info.html'),
  controller: ['$log', 'lineService', LineInfoController],
  controllerAs: 'lineInfoCtrl',
  bindings: {
    line: '<',
  },
};

function LineInfoController($log, lineService){
  $log.debug('init lineInfoCtrl');

  this.showEditLine = false;

  this.deleteLine = function() {
    lineService.deleteLine(this.line._id, this.line.projectId);
  };

}
