'use strict';

module.exports = {
  template: require('./line-li.html'),
  controller: ['$log', 'lineService',  lineLIController],
  controllerAs: 'lineLICtrl',
  bindings: {
    line: '<',
    deleteLineCheck: '&',
    project: '<',
  },
};

function lineLIController($log, lineService){
  $log.debug('init lineLICtrl');
  $log.debug('the line in lineLICtrl', this.line);

  this.showEditLine = false;

  this.deleteLine = function(){
    lineService.deleteLine(this.project, this.line)
    .then(() => {
      this.deleteLineCheck();
    });
  };
}
