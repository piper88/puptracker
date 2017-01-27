'use strict';

require('./_new-line.scss');

module.exports = {
  template: require('./new-line.html'),
  controller: ['$log', '$http', 'lineService', NewLineController],
  controllerAs: 'newLineCtrl',
  bindings: {
    project: '<',
  },
};

function NewLineController($log, $http, lineService){
  $log.debug('init newLineCtrl');

  this.line = {};

  this.createNewLine = function() {
    $log.debug('init createNewLine()');
    lineService.createLine(this.line)
    .then(line => {
      $log.debug('created a new line');
      this.line = line;
    });
  };

  // this.deleteLine = function(line) {
  //   $log.debug('init deleteLine()');
  //   lineService.deleteLine(line)
  //   .then(() => {
  //     $log.debug('deleted line');
  //   });
  // };

}
