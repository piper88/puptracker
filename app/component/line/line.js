'use strict';

//require('./_line.scss');

module.exports = {
  template: require('./line.html'),
  controller: ['$log', 'lineService', LineController],
  controllerAs: 'lineCtrl',
  bindings: {
    line: '<',
  },
};

function LineController($log, lineService){
  $log.debug('init lineCtrl');

  this.updateLine = function() {
    lineService.updateLine(this.line, this.line._id);
  };

  this.deleteLine = function() {
    lineService.deleteLine(this.line, this.line._id, this.project._id);
  };

}
