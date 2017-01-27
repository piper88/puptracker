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

  this.createNewLine = function() {
    $log.debug('init createNewLine()');
    lineService.createLine(this.project, this.line)
    .then(()=> {
      $log.debug('created a new line');
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
