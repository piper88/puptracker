'use strict';

require('./_new-line.scss');

module.exports = {
  template: require('./new-line.html'),
  controller: ['$log', '$http', 'lineService', NewLineController],
  controllerAs: 'newLineCtrl',
  bindings: {
    projectData: '<',
    //somehow need to access the cage data to make calculations on the line
    cageData: '<',
  },
};

function NewLineController($log, $http, lineService){
  $log.debug('init newLineCtrl');

  this.createNewLine = function(line) {
    $log.debug('init createNewLine()');
    lineService.createLine(line)
    .then(() => {
      $log.debug('created a new line');
    });
  };

  this.fetchLines = function() {
    $log.debug('init fetchLines()');
    lineService.fetchLines(this.projectData._id)
    .then(data => {
      this.lines = data;
    });
  };

  this.deleteLine = function(line) {
    $log.debug('init deleteLine()');
    lineService.deleteLine(line)
    .then(() => {
      $log.debug('deleted line');
    });
  };

  this.fetchLines();
}
